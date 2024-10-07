import { Injectable } from '@angular/core';
import { Article } from '../../shared/models/article.model';
import { Contact } from '../../shared/models/contact.model';
import { Event } from '../../shared/models/event.model';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  /**
   * Constructor to initialize LocalStorageService.
   */
  constructor() { }

  /**
   * Add or update a contact using `role` as the key.
   *
   * @param role - The role of the contact to be added or updated.
   * @param contact - The contact object containing contact details.
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
   * Retrieve a contact by `role`.
   *
   * @param role - The role of the contact to be retrieved.
   * @returns A promise that resolves to the contact or null if not found.
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
   * Delete a contact by `role`.
   *
   * @param role - The role of the contact to be deleted.
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
   * Get all contacts.
   *
   * @returns An observable of contact arrays.
   */
  getAllContacts(): Observable<Contact[]> {
    const contacts: Contact[] = [];

    // Loop through all items in localStorage
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith('contact-')) {
        try {
          const contact: Contact = JSON.parse(localStorage.getItem(key)!);
          if (contact) {
            contacts.push(contact); // Add contact to the array
          }
        } catch (error) {
          console.error('Error parsing contact from localStorage:', error);
        }
      }
    });

    // Return an observable of contacts
    return of(contacts); // Emit the contacts as an observable
  }

  /**
   * Add or update an event for a specific date.
   *
   * @param date - The date of the event to be added or updated.
   * @param event - The event object containing event details.
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
   * Retrieve the event for a specific date.
   *
   * @param date - The date of the event to be retrieved.
   * @returns A promise that resolves to the event or null if not found.
   */
  async getEvent(date: string): Promise<Event | null> {
    return new Promise<Event | null>((resolve) => {
      const event = localStorage.getItem(`event-${date}`);
      resolve(event ? JSON.parse(event) : null);
    });
  }

  /**
   * Delete an event for a specific date.
   *
   * @param date - The date of the event to be deleted.
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
   * Retrieve all events.
   *
   * @returns A promise that resolves to an object containing events indexed by date.
   */
  async getAllEvents(): Promise<{ [key: string]: Event[] }> {
    return new Promise<{ [key: string]: Event[] }>((resolve) => {
      const events: { [key: string]: Event[] } = {};

      // Loop through all items in localStorage
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith('event-')) {
          try {
            // Extract the date part from the key
            const date = key.substring(6); // key is in the format 'event-YYYY-MM-DD'

            // Parse the event data from localStorage
            const event: Event = JSON.parse(localStorage.getItem(key)!);

            // Ensure that the event is valid and well-formed
            if (event && event.date) {
              if (!events[date]) {
                events[date] = [];
              }
              events[date].push(event); // Add event to the corresponding date
            }
          } catch (error) {
            console.error('Error parsing event from localStorage:', error);
          }
        }
      });

      // Resolve with the correctly structured events object
      resolve(events);
    });
  }

  /**
   * Add an article to localStorage.
   *
   * @param article - The article object to be added.
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
   * Delete an article from localStorage.
   *
   * @param article - The article object to be deleted.
   */
  async deleteArticle(article: Article): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      try {
        const articles = this.getAllArticles(); // Get existing articles
        const updatedArticles = articles.filter(a => a.title !== article.title || a.date !== article.date); // Remove the article to delete
        localStorage.setItem('articles', JSON.stringify(updatedArticles)); // Save updated articles
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
   */
  async deleteAllArticles(): Promise<void> {
    localStorage.removeItem('articles');
  }

  /**
   * Retrieve all articles from localStorage.
   *
   * @returns An array of articles.
   */
  getAllArticles(): Article[] {
    const articles = localStorage.getItem('articles');
    return articles ? JSON.parse(articles) : [];
  }
}
