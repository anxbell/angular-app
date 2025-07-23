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
  // url: string = 'https://the-cms-project-default-rtdb.firebaseio.com/documents.json';
  // url: string = 'http://localhost:3000/documents';


  constructor(private http: HttpClient) {
    this.documents = MOCKDOCUMENTS;
    this.getDocuments();
    this.maxDocumentId = this.getMaxId();

  }
  // getDocuments() {
  //   this.http
  //     .get<Document[]>(this.url)
  //     .subscribe(
  //       (documents: Document[]) => {
  //         this.documents = documents;
  //         this.maxDocumentId = this.getMaxId();
  //         this.documents.sort((a, b) => {
  //           if (a.name < b.name) return -1;
  //           if (a.name > b.name) return 1;
  //           return 0;
  //         });
  //         this.documentChangedEvent.next(this.documents.slice());
  //       },
  //       (error) => {
  //         console.error(error);
  //       }
  //     );
  // }

  getDocuments() {
  // Temporarily use mock data instead of HTTP call
  this.documents = MOCKDOCUMENTS;
  this.maxDocumentId = this.getMaxId();
  this.documents.sort((a, b) => {
    if (a.name < b.name) return -1;
    if (a.name > b.name) return 1;
    return 0;
  });
  this.documentChangedEvent.next(this.documents.slice());
}


  getDocument(id: string): Document | null {
    return this.documents.find(doc => doc.id === id) || null;
  }

  deleteDocument(document: Document) {
    if (!document) {
      return;
    }
    const pos = this.documents.indexOf(document);
    if (pos < 0) {
      return;
    }
    this.documents.splice(pos, 1);
    this.storeDocuments();
    
    // const documentsListClone = this.documents.slice();
    // this.documentChangedEvent.next(documentsListClone);
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

      this.maxDocumentId++;
      newDocument.id = this.maxDocumentId.toString();
      this.documents.push(newDocument);
      this.storeDocuments();
      // const documentsListClone = this.documents.slice();
      // this.documentChangedEvent.next(documentsListClone);
    }

  updateDocument(originalDocument: Document, newDocument: Document) {
    if (!originalDocument || !newDocument) {
      return;
    }

    const pos = this.documents.indexOf(originalDocument);
    if (pos < 0) {
      return;
    }

    newDocument.id = originalDocument.id;
    this.documents[pos] = newDocument;
    this.storeDocuments();
    // const documentsListClone = this.documents.slice();
    // this.documentChangedEvent.next(documentsListClone);
  }

  storeDocuments() {
    this.documentChangedEvent.next(this.documents.slice());
  // const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  // this.http.put(this.url, JSON.stringify(this.documents), { headers }).subscribe(() => {
  //   this.documentChangedEvent.next(this.documents.slice());
  // });
}

}

