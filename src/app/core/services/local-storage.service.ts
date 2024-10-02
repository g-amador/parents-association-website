import { Injectable } from '@angular/core';
import { Article } from '../../shared/models/article.model';
import { Contact } from '../../shared/models/contact.model';
import { Event } from '../../shared/models/event.model';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  constructor() { }

  // Add or update a contact using `role` as the key
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

  // Retrieve a contact by `role`
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

  // Delete a contact by `role`
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

  // Get all contacts
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

  async updateArticle(article: Article): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      try {
        const articles = this.getAllArticles(); // Get existing articles
        articles.push(article); // update article
        localStorage.setItem('articles', JSON.stringify(articles)); // Save all articles
        console.log('Article successfully updated in localStorage!');
        resolve();
      } catch (error) {
        console.error('Error updating article to localStorage:', error);
        reject(error);
      }
    });
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

  // Retrieve all articles
  getAllArticles(): Article[] {
    const articles = localStorage.getItem('articles');
    return articles ? JSON.parse(articles) : [];
  }
}
