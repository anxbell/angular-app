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
  filteredDocuments: Document[] = [];
  subscription: Subscription;
  
  // Filter and search properties
  searchTerm: string = '';
  selectedFilter: string = 'all';
  sortBy: string = 'name';

  constructor(private documentService: DocumentService) {}

  ngOnInit(): void {
    this.documentService.getDocuments();

    this.subscription = this.documentService.documentChangedEvent.subscribe((documents: Document[]) => {
      this.documents = documents;
      this.applyFiltersAndSort();
    });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  onSearch() {
    this.applyFiltersAndSort();
  }

  filterBy(filter: string) {
    this.selectedFilter = filter;
    this.applyFiltersAndSort();
  }

  onSort() {
    this.applyFiltersAndSort();
  }

  clearFilters() {
    this.searchTerm = '';
    this.selectedFilter = 'all';
    this.sortBy = 'name';
    this.applyFiltersAndSort();
  }

  private applyFiltersAndSort() {
    let filtered = [...this.documents];

    // Apply search filter
    if (this.searchTerm.trim()) {
      const searchLower = this.searchTerm.toLowerCase();
      filtered = filtered.filter(doc => 
        doc.name.toLowerCase().includes(searchLower) ||
        doc.brand?.toLowerCase().includes(searchLower) ||
        doc.description?.toLowerCase().includes(searchLower) ||
        doc.frameType?.toLowerCase().includes(searchLower) ||
        doc.lensColor?.toLowerCase().includes(searchLower)
      );
    }

    // Apply category filter
    if (this.selectedFilter !== 'all') {
      if (this.selectedFilter === 'sunglasses') {
        filtered = filtered.filter(doc => 
          doc.uvProtection?.includes('UV') || 
          doc.lensColor?.toLowerCase().includes('dark') ||
          doc.lensColor?.toLowerCase().includes('black') ||
          doc.lensColor?.toLowerCase().includes('brown') ||
          doc.uvProtection?.includes('Polarized')
        );
      } else if (this.selectedFilter === 'eyeglasses') {
        filtered = filtered.filter(doc => 
          doc.lensColor?.toLowerCase().includes('clear') ||
          doc.uvProtection?.includes('Blue Light') ||
          doc.uvProtection?.includes('Anti-Reflective') ||
          (!doc.uvProtection?.includes('UV') && !doc.uvProtection?.includes('Polarized'))
        );
      }
    }

    // Apply sorting
    switch (this.sortBy) {
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'price-low':
        filtered.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case 'price-high':
        filtered.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case 'brand':
        filtered.sort((a, b) => (a.brand || '').localeCompare(b.brand || ''));
        break;
    }

    this.filteredDocuments = filtered;
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

  getPolarizedCount(): number {
    return this.documents.filter(doc => 
      doc.uvProtection?.includes('Polarized')
    ).length;
  }
}