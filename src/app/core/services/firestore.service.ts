import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { Article } from '../../shared/models/article.model';
import { Contact } from '../../shared/models/contact.model';
import { Event } from '../../shared/models/event.model';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {
  /**
   * Constructor to initialize FirestoreService with AngularFirestore.
   *
   * @param firestore - AngularFirestore instance for Firestore operations.
   */
  constructor(private firestore: AngularFirestore) { }

  /**
   * Add or update a contact using `role` as the key.
   *
   * @param role - The role of the contact to be added or updated.
   * @param contact - The contact object containing contact details.
   */
  async setContact(role: string, contact: Contact): Promise<void> {
    try {
      await this.firestore.collection('contacts').doc(role).set(contact, { merge: true });
      console.log(`Contact with role: ${role} updated successfully.`);
    } catch (error) {
      console.error('Error updating contact: ', error);
      throw error;
    }
  }

  /**
   * Retrieve a contact by `role`.
   *
   * @param role - The role of the contact to be retrieved.
   * @returns A promise that resolves to the contact or null if not found.
   */
  async getContact(role: string): Promise<Contact | null> {
    return new Promise<Contact | null>((resolve, reject) => {
      this.firestore.collection('contacts').doc(role).get().toPromise()
        .then(doc => {
          if (doc && doc.exists) {
            const data = doc.data();
            if (data) {
              // Ensure data is an object before spreading it
              resolve({ ...data, role } as Contact); // Safe to access doc.data()
            } else {
              resolve(null); // If data is not an object, return null
            }
          } else {
            resolve(null); // Document does not exist
          }
        })
        .catch(error => {
          console.error('Error retrieving contact from Firestore:', error);
          reject(error);
        });
    });
  }

  /**
   * Delete a contact by `role`.
   *
   * @param role - The role of the contact to be deleted.
   */
  async deleteContact(role: string): Promise<void> {
    try {
      await this.firestore.collection('contacts').doc(role).delete();
      console.log(`Contact with role: ${role} deleted successfully.`);
    } catch (error) {
      console.error('Error deleting contact: ', error);
      throw error;
    }
  }

  /**
   * Get all contacts.
   *
   * @returns An observable of contact arrays.
   */
  getAllContacts(): Observable<Contact[]> {
    return this.firestore.collection<Contact>('contacts').valueChanges({ idField: 'id' });
  }

  /**
   * Add or update an event for a specific date.
   *
   * @param date - The date of the event to be added or updated.
   * @param event - The event object containing event details.
   */
  async setEvent(date: string, event: Event): Promise<void> {
    try {
      await this.firestore.collection('events').doc(date).set(event, { merge: true });
      console.log(`Event for date: ${date} updated successfully.`);
    } catch (error) {
      console.error('Error updating event: ', error);
      throw error;
    }
  }

  /**
   * Delete an event for a specific date.
   *
   * @param date - The date of the event to be deleted.
   */
  async deleteEvent(date: string): Promise<void> {
    try {
      await this.firestore.collection('events').doc(date).delete();
      console.log(`Event for date: ${date} deleted successfully.`);
    } catch (error) {
      console.error('Error deleting event: ', error);
      throw error;
    }
  }

  /**
   * Get all events.
   *
   * @returns An observable of event arrays.
   */
  getAllEvents(): Observable<Event[]> {
    return this.firestore.collection<Event>('events').valueChanges();
  }

  /**
   * Add a new article (Firestore auto-generates an ID).
   *
   * @param article - The article object to be added.
   */
  async addArticle(article: Article): Promise<void> {
    try {
      await this.firestore.collection('articles').add(article);
      console.log('Article added successfully.');
    } catch (error) {
      console.error('Error adding article: ', error);
      throw error;
    }
  }

  /**
   * Update an article by document ID (use the document ID for specific updates).
   *
   * @param articleId - The ID of the article to be updated.
   * @param article - The article object containing updated details.
   */
  async updateArticle(articleId: string, article: Article): Promise<void> {
    try {
      await this.firestore.collection('articles').doc(articleId).set(article, { merge: true });
      console.log(`Article with ID: ${articleId} updated successfully.`);
    } catch (error) {
      console.error('Error updating article: ', error);
      throw error;
    }
  }

  /**
   * Delete an article by document ID.
   *
   * @param articleId - The ID of the article to be deleted.
   */
  async deleteArticle(articleId: string): Promise<void> {
    try {
      await this.firestore.collection('articles').doc(articleId).delete();
      console.log(`Article with ID: ${articleId} deleted successfully.`);
    } catch (error) {
      console.error('Error deleting article: ', error);
      throw error;
    }
  }

  /**
   * Delete all articles.
   */
  async deleteAllArticles(): Promise<void> {
    const articlesSnapshot = await this.firestore.collection('articles').get().toPromise();
    const deletePromises = articlesSnapshot!.docs.map(doc => this.deleteArticle(doc.id));
    await Promise.all(deletePromises);
    console.log('All articles deleted successfully.');
  }

  /**
   * Get all articles, making sure to include the document ID as 'id'.
   *
   * @returns An observable of article arrays.
   */
  getAllArticles(): Observable<Article[]> {
    return this.firestore.collection<Article>('articles').valueChanges({ idField: 'id' });
  }
}
