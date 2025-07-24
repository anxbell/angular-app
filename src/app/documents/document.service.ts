import { Injectable, EventEmitter } from '@angular/core';
import { Document } from './document.model';
import { MOCKDOCUMENTS } from './MOCKDOCUMENTS';
import { Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  documents: Document[] = [];
  documentSelectedEvent = new Subject<Document>();
  documentChangedEvent = new Subject<Document[]>();
  maxDocumentId: number;
  
  // Update this URL to match your backend server
  private url: string = 'http://localhost:3000/documents';
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) {
    this.maxDocumentId = 0;
    // Initialize with backend data instead of mock data
    this.getDocuments();
  }

  getDocuments() {
    this.http.get<Document[]>(this.url).subscribe({
      next: (documents: Document[]) => {
        this.documents = documents;
        this.maxDocumentId = this.getMaxId();
        this.documents.sort((a, b) => {
          if (a.name < b.name) return -1;
          if (a.name > b.name) return 1;
          return 0;
        });
        this.documentChangedEvent.next(this.documents.slice());
      },
      error: (error) => {
        console.error('Error fetching documents:', error);
        // Fallback to mock data if backend is not available
        console.log('Falling back to mock data...');
        this.documents = MOCKDOCUMENTS;
        this.maxDocumentId = this.getMaxId();
        this.documents.sort((a, b) => {
          if (a.name < b.name) return -1;
          if (a.name > b.name) return 1;
          return 0;
        });
        this.documentChangedEvent.next(this.documents.slice());
      }
    });
  }

  getDocument(id: string): Document | null {
    return this.documents.find(doc => doc.id === id) || null;
  }

  deleteDocument(document: Document) {
    if (!document) {
      return;
    }

    this.http.delete(`${this.url}/${document.id}`).subscribe({
      next: (response) => {
        console.log('Document deleted successfully:', response);
        const pos = this.documents.indexOf(document);
        if (pos >= 0) {
          this.documents.splice(pos, 1);
          this.documentChangedEvent.next(this.documents.slice());
        }
      },
      error: (error) => {
        console.error('Error deleting document:', error);
        // Still remove from local array as fallback
        const pos = this.documents.indexOf(document);
        if (pos >= 0) {
          this.documents.splice(pos, 1);
          this.documentChangedEvent.next(this.documents.slice());
        }
      }
    });
  }

  getMaxId(): number {
    let maxId = 0;
    for (let document of this.documents) {
      const currentId = parseInt(document.id);
      if (currentId > maxId) {
        maxId = currentId;
      }
    }
    return maxId;
  }

  addDocument(newDocument: Document) {
    if (!newDocument) {
      return;
    }

    // Create a copy without the id for the backend
    const documentData = { ...newDocument };
    delete documentData.id; // Let backend assign the ID

    this.http.post<any>(this.url, documentData, this.httpOptions).subscribe({
      next: (response) => {
        console.log('Document added successfully:', response);
        // Add the returned document with the assigned ID
        if (response.document) {
          this.documents.push(response.document);
        } else {
          // Fallback if response format is different
          this.maxDocumentId++;
          newDocument.id = this.maxDocumentId.toString();
          this.documents.push(newDocument);
        }
        this.documents.sort((a, b) => a.name.localeCompare(b.name));
        this.documentChangedEvent.next(this.documents.slice());
      },
      error: (error) => {
        console.error('Error adding document:', error);
        // Fallback to local storage
        this.maxDocumentId++;
        newDocument.id = this.maxDocumentId.toString();
        this.documents.push(newDocument);
        this.documents.sort((a, b) => a.name.localeCompare(b.name));
        this.documentChangedEvent.next(this.documents.slice());
      }
    });
  }

  updateDocument(originalDocument: Document, newDocument: Document) {
    if (!originalDocument || !newDocument) {
      return;
    }

    const pos = this.documents.indexOf(originalDocument);
    if (pos < 0) {
      return;
    }

    // Keep the original ID
    newDocument.id = originalDocument.id;

    this.http.put(`${this.url}/${originalDocument.id}`, newDocument, this.httpOptions).subscribe({
      next: (response: any) => {
        console.log('Document updated successfully:', response);
        // Update local array
        if (response.document) {
          this.documents[pos] = response.document;
        } else {
          this.documents[pos] = newDocument;
        }
        this.documents.sort((a, b) => a.name.localeCompare(b.name));
        this.documentChangedEvent.next(this.documents.slice());
      },
      error: (error) => {
        console.error('Error updating document:', error);
        // Fallback to local update
        this.documents[pos] = newDocument;
        this.documents.sort((a, b) => a.name.localeCompare(b.name));
        this.documentChangedEvent.next(this.documents.slice());
      }
    });
  }

  storeDocuments() {
    // This method is now handled by individual CRUD operations
    this.documentChangedEvent.next(this.documents.slice());
  }
}