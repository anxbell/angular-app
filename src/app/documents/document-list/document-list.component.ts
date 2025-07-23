import { Component, OnInit, OnDestroy } from '@angular/core';
import { Document } from '../document.model';
import { DocumentService } from '../document.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'cms-document-list',
  standalone: false,
  templateUrl: './document-list.component.html',
  styleUrl: './document-list.component.css'
})
export class DocumentListComponent implements OnInit, OnDestroy {

  documents: Document[] = [];
  subscription: Subscription;

  constructor(private documentService: DocumentService) {}

  ngOnInit(): void {
    this.documentService.getDocuments();

    this.subscription = this.documentService.documentChangedEvent.subscribe((documents: Document[]) => {
      this.documents = documents;
    });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  getAveragePrice(): number {
    if (this.documents.length === 0) return 0;
    
    const pricesSum = this.documents
      .filter(doc => doc.price && doc.price > 0)
      .reduce((sum, doc) => sum + (doc.price || 0), 0);
    
    const itemsWithPrice = this.documents.filter(doc => doc.price && doc.price > 0).length;
    
    return itemsWithPrice > 0 ? pricesSum / itemsWithPrice : 0;
  }

  getUniqueBrands(): number {
    const brands = new Set(
      this.documents
        .filter(doc => doc.brand && doc.brand.trim() !== '')
        .map(doc => doc.brand)
    );
    return brands.size;
  }
}