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
  constructor(private firestore: AngularFirestore) { }

  // Add or update a contact
  async setContact(contactId: string, data: Contact): Promise<void> {
    try {
      await this.firestore.collection('contacts').doc(contactId).set(data, { merge: true });
      console.log(`Contact with ID: ${contactId} updated successfully.`);
    } catch (error) {
      console.error('Error updating contact: ', error);
      throw error;
    }
  }

  // Delete a contact
  async deleteContact(contactId: string): Promise<void> {
    try {
      await this.firestore.collection('contacts').doc(contactId).delete();
      console.log(`Contact with ID: ${contactId} deleted successfully.`);
    } catch (error) {
      console.error('Error deleting contact: ', error);
      throw error;
    }
  }

  // Get all contacts
  getContacts(): Observable<Contact[]> {
    return this.firestore.collection<Contact>('contacts').valueChanges();
  }

  // Add or update an event
  async setEvent(date: string, data: Event): Promise<void> {
    try {
      await this.firestore.collection('events').doc(date).set(data, { merge: true });
      console.log(`Event for date: ${date} updated successfully.`);
    } catch (error) {
      console.error('Error updating event: ', error);
      throw error;
    }
  }

  // Delete an event
  async deleteEvent(date: string): Promise<void> {
    try {
      await this.firestore.collection('events').doc(date).delete();
      console.log(`Event for date: ${date} deleted successfully.`);
    } catch (error) {
      console.error('Error deleting event: ', error);
      throw error;
    }
  }

  // Get all events
  getEvents(): Observable<Event[]> {
    return this.firestore.collection<Event>('events').valueChanges();
  }

  // Add a new article (Firestore auto-generates an ID)
  async addArticle(article: Article): Promise<void> {
    try {
      await this.firestore.collection('articles').add(article);
      console.log(`Article added successfully.`);
    } catch (error) {
      console.error('Error adding article: ', error);
      throw error;
    }
  }

  // Update an article by document ID (use the document ID for specific updates)
  async updateArticle(articleId: string, article: Article): Promise<void> {
    try {
      await this.firestore.collection('articles').doc(articleId).set(article, { merge: true });
      console.log(`Article with ID: ${articleId} updated successfully.`);
    } catch (error) {
      console.error('Error updating article: ', error);
      throw error;
    }
  }

  // Delete an article by document ID
  async deleteArticle(articleId: string): Promise<void> {
    try {
      await this.firestore.collection('articles').doc(articleId).delete();
      console.log(`Article with ID: ${articleId} deleted successfully.`);
    } catch (error) {
      console.error('Error deleting article: ', error);
      throw error;
    }
  }

  // Delete all articles
  async deleteAllArticles(): Promise<void> {
    const articlesSnapshot = await this.firestore.collection('articles').get().toPromise();

    // Create an array of delete promises
    const deletePromises = articlesSnapshot!.docs.map(doc => this.deleteArticle(doc.id));

    // Wait for all delete promises to resolve
    await Promise.all(deletePromises);
    console.log('All articles deleted successfully.');
  }

  // Get all articles, making sure to include the document ID as 'id'
  getArticles(): Observable<Article[]> {
    return this.firestore.collection<Article>('articles').valueChanges({ idField: 'id' });
  }
}
