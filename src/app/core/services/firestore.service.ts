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

  // Add or update an article
  async setArticle(date: string, article: Article): Promise<void> {
    try {
      await this.firestore.collection('articles').doc(date).set(article, { merge: true });
      console.log(`Article for date: ${date} updated successfully.`);
    } catch (error) {
      console.error('Error updating article: ', error);
      throw error;
    }
  }

  // Delete an article
  async deleteArticle(date: string): Promise<void> {
    try {
      await this.firestore.collection('articles').doc(date).delete();
      console.log(`Article for date: ${date} deleted successfully.`);
    } catch (error) {
      console.error('Error deleting article: ', error);
      throw error;
    }
  }

  // Get all articles
  getArticles(): Observable<Article[]> {
    return this.firestore.collection<Article>('articles').valueChanges();
  }
}
