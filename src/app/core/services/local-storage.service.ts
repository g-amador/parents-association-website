import { Injectable } from '@angular/core';
import { Article } from '../../shared/models/article.model';
import { Contact } from '../../shared/models/contact.model';
import { Event } from '../../shared/models/event.model';
import { Observable, of } from 'rxjs';

/**
 * LocalStorageService provides methods to interact with the browser's local storage,
 * allowing for the storage, retrieval, and deletion of various data types, including
 * contacts, events, and articles.
 *
 * @class LocalStorageService
 * @example
 * const localStorageService = new LocalStorageService();
 * await localStorageService.setContact('admin', contact);
 * const allContacts = await localStorageService.getAllContacts().toPromise();
 *
 * @module LocalStorageModule
 */
@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  constructor() { }

  /**
   * Sets an item in local storage.
   * @param {string} key - The key under which the item is stored.
   * @param {any} value - The value to be stored, will be serialized to JSON.
   */
  setItem(key: string, value: any): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  /**
   * Retrieves an item from local storage.
   * @param {string} key - The key of the item to retrieve.
   * @returns {any} - The parsed value from local storage, or null if not found.
   */
  getItem(key: string): any {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  }

  /**
   * Deletes an item from local storage.
   * @param {string} key - The key of the item to delete.
   */
  deleteItem(key: string): void {
    localStorage.removeItem(key);
  }

  /**
   * Sets a contact in local storage.
   * @param {string} role - The role associated with the contact.
   * @param {Contact} contact - The contact object to save.
   * @returns {Promise<void>} - A promise that resolves when the contact is saved.
   */
  async setContact(role: string, contact: Contact): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      try {
        localStorage.setItem(`contact-${role}`, JSON.stringify(contact));
        console.log('Contact successfully saved to localStorage!');
        resolve();
      } catch (error) {
        console.error('Error saving contact to localStorage:', error);
        reject(error);
      }
    });
  }

  /**
   * Retrieves a contact from local storage by role.
   * @param {string} role - The role of the contact to retrieve.
   * @returns {Promise<Contact | null>} - A promise that resolves with the contact or null if not found.
   */
  async getContact(role: string): Promise<Contact | null> {
    return new Promise<Contact | null>((resolve, reject) => {
      try {
        const contact = localStorage.getItem(`contact-${role}`);
        resolve(contact ? JSON.parse(contact) : null);
      } catch (error) {
        console.error('Error retrieving contact from localStorage:', error);
        reject(error);
      }
    });
  }

  /**
   * Deletes a contact from local storage by role.
   * @param {string} role - The role of the contact to delete.
   * @returns {Promise<void>} - A promise that resolves when the contact is deleted.
   */
  async deleteContact(role: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      try {
        localStorage.removeItem(`contact-${role}`);
        console.log('Contact successfully deleted from localStorage!');
        resolve();
      } catch (error) {
        console.error('Error deleting contact from localStorage:', error);
        reject(error);
      }
    });
  }

  /**
   * Retrieves all contacts from local storage.
   * @returns {Observable<Contact[]>} - An observable of all contacts found in local storage.
   */
  getAllContacts(): Observable<Contact[]> {
    const contacts: Contact[] = [];
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith('contact-')) {
        try {
          const contact: Contact = JSON.parse(localStorage.getItem(key)!);
          if (contact) {
            contacts.push(contact);
          }
        } catch (error) {
          console.error('Error parsing contact from localStorage:', error);
        }
      }
    });
    return of(contacts);
  }

  /**
   * Sets an event in local storage.
   * @param {string} date - The date associated with the event.
   * @param {Event} event - The event object to save.
   * @returns {Promise<void>} - A promise that resolves when the event is saved.
   */
  async setEvent(date: string, event: Event): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      try {
        localStorage.setItem(`event-${date}`, JSON.stringify(event));
        console.log('Event successfully saved to localStorage!');
        resolve();
      } catch (error) {
        console.error('Error saving event to localStorage:', error);
        reject(error);
      }
    });
  }

  /**
   * Retrieves an event from local storage by date.
   * @param {string} date - The date of the event to retrieve.
   * @returns {Promise<Event | null>} - A promise that resolves with the event or null if not found.
   */
  async getEvent(date: string): Promise<Event | null> {
    return new Promise<Event | null>((resolve) => {
      const event = localStorage.getItem(`event-${date}`);
      resolve(event ? JSON.parse(event) : null);
    });
  }

  /**
   * Deletes an event from local storage by date.
   * @param {string} date - The date of the event to delete.
   * @returns {Promise<void>} - A promise that resolves when the event is deleted.
   */
  async deleteEvent(date: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      try {
        localStorage.removeItem(`event-${date}`);
        console.log('Event successfully deleted from localStorage!');
        resolve();
      } catch (error) {
        console.error('Error deleting event from localStorage:', error);
        reject(error);
      }
    });
  }

  /**
   * Retrieves all events from local storage.
   * @returns {Promise<{ [key: string]: Event[] }>} - A promise that resolves with an object containing arrays of events, grouped by date.
   */
  async getAllEvents(): Promise<{ [key: string]: Event[] }> {
    return new Promise<{ [key: string]: Event[] }>((resolve) => {
      const events: { [key: string]: Event[] } = {};
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith('event-')) {
          try {
            const date = key.substring(6);
            const event: Event = JSON.parse(localStorage.getItem(key)!);
            if (event && event.date) {
              if (!events[date]) {
                events[date] = [];
              }
              events[date].push(event);
            }
          } catch (error) {
            console.error('Error parsing event from localStorage:', error);
          }
        }
      });
      resolve(events);
    });
  }

  /**
   * Add an article to localStorage.
   *
   * @param article - The article object to be added.
   * @return A promise that resolves when the article is successfully saved.
   */
  async addArticle(article: Article): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      try {
        const articles = this.getAllArticles(); // Get existing articles
        articles.push(article); // Add the new article
        localStorage.setItem('articles', JSON.stringify(articles)); // Save all articles
        console.log('Article successfully saved to localStorage!');
        resolve();
      } catch (error) {
        console.error('Error saving article to localStorage:', error);
        reject(error);
      }
    });
  }

  /**
   * Update an article in localStorage.
   *
   * @param article - The article object to be updated.
   * @return A promise that resolves when the article is successfully updated.
   */
  async updateArticle(article: Article): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      try {
        const articles = this.getAllArticles(); // Get existing articles
        articles.push(article); // Update article
        localStorage.setItem('articles', JSON.stringify(articles)); // Save all articles
        console.log('Article successfully updated in localStorage!');
        resolve();
      } catch (error) {
        console.error('Error updating article in localStorage:', error);
        reject(error);
      }
    });
  }

  /**
   * Deletes an article from local storage.
   * @param {Article} article - The article object to delete.
   * @returns {Promise<void>} - A promise that resolves when the article is deleted.
   */
  async deleteArticle(article: Article): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      try {
        const articles = this.getAllArticles();
        const filteredArticles = articles.filter(a => a.title !== article.title && a.date !== article.date);
        localStorage.setItem('articles', JSON.stringify(filteredArticles));
        console.log('Article successfully deleted from localStorage!');
        resolve();
      } catch (error) {
        console.error('Error deleting article from localStorage:', error);
        reject(error);
      }
    });
  }

  /**
   * Clear all articles from localStorage.
   *
   * @return A promise that resolves when all articles are deleted.
   */
  async deleteAllArticles(): Promise<void> {
    localStorage.removeItem('articles');
  }

  /**
   * Retrieves all articles from local storage.
   * @returns {Article[]} - An array of articles found in local storage.
   */
  getAllArticles(): Article[] {
    const articlesJson = localStorage.getItem('articles');
    return articlesJson ? JSON.parse(articlesJson) : [];
  }
}
