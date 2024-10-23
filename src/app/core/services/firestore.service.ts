import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { Article } from '../../shared/models/article.model';
import { Contact } from '../../shared/models/contact.model';
import { Event } from '../../shared/models/event.model';
import { User } from '../../shared/models/user.model';

/**
 * FirestoreService provides methods for interacting with Firestore, including
 * operations on users, contacts, events, and articles. This service handles
 * CRUD operations and ensures data consistency in a Firestore-backed environment.
 *
 * @class FirestoreService
 * @see {@link https://firebase.google.com/docs/firestore} for Firestore documentation.
 */
@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  /**
   * Initializes FirestoreService with an AngularFirestore instance.
   *
   * @param firestore - AngularFirestore instance for Firestore operations.
   */
  constructor(private firestore: AngularFirestore) { }

  /**
   * Retrieves the password for a specific user based on their email.
   *
   * @param email - The user's email address.
   * @return A promise resolving to the user's password, or null if not found.
   */
  async getUserPassword(email: string): Promise<string | null> {
    try {
      const doc = await this.firestore.collection('users').doc(email).get().toPromise();
      if (doc!.exists) {
        const userData = doc!.data() as User;
        return userData.password || null;
      }
      return null;
    } catch (error) {
      console.error(`Error fetching password for email ${email}:`, error);
      throw error;
    }
  }

  /**
   * Updates or creates a user password in Firestore.
   *
   * @param email - The user's email address.
   * @param password - The new password to be saved.
   */
  async updateUserPassword(email: string, password: string): Promise<void> {
    try {
      const userRef = this.firestore.collection('users').doc(email);
      const doc = await userRef.get().toPromise();

      if (doc!.exists) {
        await userRef.update({ password });
        console.log(`Password for email: ${email} updated successfully.`);
      } else {
        await userRef.set({ password });
        console.log(`Password for email: ${email} created successfully.`);
      }
    } catch (error) {
      console.error(`Error updating/creating password for email ${email}:`, error);
      throw error;
    }
  }

  /**
   * Adds or updates contact information by role.
   *
   * @param role - The role of the contact (e.g., 'contact-Assembly').
   * @param data - Contact data to be saved.
   */
  async setContact(role: string, data: any): Promise<void> {
    try {
      await this.firestore.collection('contacts').doc(role).set(data);
    } catch (error) {
      console.error(`Error saving contact role ${role} to Firestore:`, error);
      throw error;
    }
  }

  /**
   * Retrieves contact information by role.
   *
   * @param role - The role of the contact.
   * @return A promise resolving to the contact data, or null if not found.
   */
  async getContact(role: string): Promise<any> {
    try {
      const doc = await this.firestore.collection('contacts').doc(role).get().toPromise();
      return doc!.exists ? doc!.data() : null;
    } catch (error) {
      console.error(`Error fetching contact role ${role} from Firestore:`, error);
      throw error;
    }
  }

  /**
   * Deletes a contact based on role.
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
   * Retrieves all contacts from Firestore.
   *
   * @return An observable containing an array of Contact objects.
   */
  getAllContacts(): Observable<Contact[]> {
    return this.firestore.collection<Contact>('contacts').valueChanges({ idField: 'id' });
  }

  /**
   * Adds or updates an event for a specified date.
   *
   * @param date - The date of the event.
   * @param event - The event data.
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
   * Deletes an event for a specific date.
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
   * Retrieves all events from Firestore.
   *
   * @return An observable containing an array of Event objects.
   */
  getAllEvents(): Observable<Event[]> {
    return this.firestore.collection<Event>('events').valueChanges();
  }

  /**
   * Adds a new article to Firestore. Firestore will generate a unique ID for the article.
   *
   * @param article - The article data.
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
   * Updates an existing article in Firestore by its document ID.
   *
   * @param articleId - The ID of the article to update.
   * @param article - The updated article data.
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
   * Deletes an article from Firestore by its document ID.
   *
   * @param articleId - The ID of the article to delete.
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
   * Deletes all articles from Firestore.
   */
  async deleteAllArticles(): Promise<void> {
    const articlesSnapshot = await this.firestore.collection('articles').get().toPromise();
    const deletePromises = articlesSnapshot!.docs.map(doc => this.deleteArticle(doc.id));
    await Promise.all(deletePromises);
    console.log('All articles deleted successfully.');
  }

  /**
   * Retrieves all articles from Firestore, ensuring the document ID is included.
   *
   * @return An observable containing an array of Article objects.
   */
  getAllArticles(): Observable<Article[]> {
    return this.firestore.collection<Article>('articles').valueChanges({ idField: 'id' });
  }
}
