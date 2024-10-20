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

  // Set an item in Firestore
  setItem(key: string, value: any): Promise<void> {
    return this.firestore.collection('items').doc(key).set(value);
  }

  // Get an item from Firestore
  getItem(key: string): Observable<any> {
    return this.firestore.collection('items').doc(key).valueChanges();
  }

  // Delete an item from Firestore
  deleteItem(key: string): Promise<void> {
    return this.firestore.collection('items').doc(key).delete();
  }

  // Get all items from Firestore
  getAllItems(): Observable<any[]> {
    return this.firestore.collection('items').valueChanges();
  }

  /**
   * Add or update a contact by its key (e.g., 'contact-Assembly').
   *
   * @param role - The role of the contact.
   * @param data - The contact data to be saved or updated.
   * @return A promise that resolves when the contact is successfully saved.
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
   * Retrieve a contact by group by its key (e.g., 'contact-Assembly').
   *
   * @param groupKey - The key of the contact group to retrieve.
   * @return A promise that resolves with the contact data if found, or null if not.
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
   * Delete a contact by `role`.
   *
   * @param role - The role of the contact to be deleted.
   * @return A promise that resolves when the contact is successfully deleted.
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
   * @return An observable of contact arrays.
   */
  getAllContacts(): Observable<Contact[]> {
    return this.firestore.collection<Contact>('contacts').valueChanges({ idField: 'id' });
  }

  /**
   * Add or update an event for a specific date.
   *
   * @param date - The date of the event to be added or updated.
   * @param event - The event object containing event details.
   * @return A promise that resolves when the event is successfully saved.
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
   * @return A promise that resolves when the event is successfully deleted.
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
   * @return An observable of event arrays.
   */
  getAllEvents(): Observable<Event[]> {
    return this.firestore.collection<Event>('events').valueChanges();
  }

  /**
   * Add a new article (Firestore auto-generates an ID).
   *
   * @param article - The article object to be added.
   * @return A promise that resolves when the article is successfully added.
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
   * @return A promise that resolves when the article is successfully updated.
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
   * @return A promise that resolves when the article is successfully deleted.
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
   *
   * @return A promise that resolves when all articles are successfully deleted.
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
   * @return An observable of article arrays.
   */
  getAllArticles(): Observable<Article[]> {
    return this.firestore.collection<Article>('articles').valueChanges({ idField: 'id' });
  }
}
