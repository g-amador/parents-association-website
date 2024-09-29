import { Injectable } from '@angular/core';
import { Article } from '../../shared/models/article.model';
import { Contact } from '../../shared/models/contact.model';
import { Event } from '../../shared/models/event.model';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  constructor() {}

  // Add or update a contact
  async addContact(contactId: string, contact: Contact): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      try {
        localStorage.setItem(`contact-${contactId}`, JSON.stringify(contact));
        console.log('Contact successfully saved to localStorage!');
        resolve();
      } catch (error) {
        console.error('Error saving contact to localStorage:', error);
        reject(error);
      }
    });
  }

  // Retrieve a contact
  async getContact(contactId: string): Promise<Contact | null> {
    return new Promise<Contact | null>((resolve, reject) => {
      try {
        const contact = localStorage.getItem(`contact-${contactId}`);
        resolve(contact ? JSON.parse(contact) : null);
      } catch (error) {
        console.error('Error retrieving contact from localStorage:', error);
        reject(error);
      }
    });
  }

  // Delete a contact
  async deleteContact(contactId: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      try {
        localStorage.removeItem(`contact-${contactId}`);
        console.log('Contact successfully deleted from localStorage!');
        resolve();
      } catch (error) {
        console.error('Error deleting contact from localStorage:', error);
        reject(error);
      }
    });
  }

  // Add or update an event for a specific date
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

  // Retrieve the event for a specific date
  async getEvent(date: string): Promise<Event | null> {
    return new Promise<Event | null>((resolve) => {
      const event = localStorage.getItem(`event-${date}`);
      resolve(event ? JSON.parse(event) : null);
    });
  }

  // Delete an event for a specific date
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

  // Retrieve all events
  async getAllEvents(): Promise<{ [key: string]: Event[] }> {
    return new Promise<{ [key: string]: Event[] }>((resolve) => {
      const events: { [key: string]: Event[] } = {};
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith('event-')) {
          const date = key.split('-')[1];
          const event = JSON.parse(localStorage.getItem(key)!);
          if (!events[date]) {
            events[date] = [];
          }
          events[date].push(event);
        }
      });
      resolve(events);
    });
  }

  // Add or update an article
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

  // Retrieve all articles
  getAllArticles(): Article[] {
    const articles = localStorage.getItem('articles');
    return articles ? JSON.parse(articles) : [];
  }

  // Delete an article
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
}
