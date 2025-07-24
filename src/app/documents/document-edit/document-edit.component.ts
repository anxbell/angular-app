import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Document } from '../document.model';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { DocumentService } from '../document.service';

@Component({
  selector: 'cms-document-edit',
  standalone: false,
  templateUrl: './document-edit.component.html',
  styleUrls: ['./document-edit.component.css']
})
export class DocumentEditComponent implements OnInit {
  originalDocument: Document | null = null;
  document: Document = new Document('', '', '', '', [], undefined, '', '', '', '');
  editMode: boolean = false;
  isLoading: boolean = false;
  showDebug: boolean = false; // Toggle for debug panel

  constructor(
    private documentService: DocumentService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Enable debug mode in development (you can remove this in production)
    this.showDebug = false; // Set to true for debugging
    
    this.route.params.subscribe(
      (params: Params) => {
        const id = params['id'];
        if (!id) {
          this.editMode = false;
          // Create empty document for add mode
          this.document = new Document('', '', '', '', [], undefined, '', '', '', '');
          return;
        }
        
        this.originalDocument = this.documentService.getDocument(id);
        if (!this.originalDocument) {
          // If document not found, redirect
          this.router.navigate(['/documents']);
          return;
        }
        
        this.editMode = true;
        // Create deep copy of original document
        this.document = this.deepCopyDocument(this.originalDocument);
      }
    );
  }

  private deepCopyDocument(doc: Document): Document {
    return new Document(
      doc.id,
      doc.name || '',
      doc.description || '',
      doc.url || '',
      doc.children ? [...doc.children] : [],
      doc.price,
      doc.brand || '',
      doc.frameType || '',
      doc.lensColor || '',
      doc.uvProtection || ''
    );
  }

  onCancel() {
    if (this.editMode && this.originalDocument) {
      this.router.navigate(['/documents', this.originalDocument.id]);
    } else {
      this.router.navigate(['/documents']);
    }
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      console.log('Form is invalid, not submitting');
      this.markAllFieldsAsTouched(form);
      return;
    }

    this.isLoading = true;
    const value = form.value;
    
    // Create new document with all properties
    const newDocument = new Document(
      this.document.id || '',
      value.name?.trim() || '', 
      value.description?.trim() || '', 
      value.url?.trim() || '', 
      this.document.children || [],
      value.price ? parseFloat(value.price) : undefined,
      value.brand?.trim() || '',
      value.frameType || '',
      value.lensColor?.trim() || '',
      value.uvProtection || ''
    );
    
    console.log('Document to save:', newDocument);
    
    try {
      if (this.editMode && this.originalDocument) {
        console.log('Updating existing document');
        this.documentService.updateDocument(this.originalDocument, newDocument);
        
        // Navigate to the updated document detail view
        setTimeout(() => {
          this.isLoading = false;
          this.router.navigate(['/documents', this.originalDocument!.id]);
        }, 500);
      } else {
        console.log('Adding new document');
        this.documentService.addDocument(newDocument);
        
        // Navigate to the documents list
        setTimeout(() => {
          this.isLoading = false;
          this.router.navigate(['/documents']);
        }, 500);
      }
      
    } catch (error) {
      console.error('Error saving document:', error);
      this.isLoading = false;
      // You could add error handling UI here
    }
  }

  private markAllFieldsAsTouched(form: NgForm) {
    Object.keys(form.controls).forEach(key => {
      form.controls[key].markAsTouched();
    });
  }

  // Helper methods for better UX
  toggleDebug() {
    this.showDebug = !this.showDebug;
  }

  getCharacterCount(): number {
    return this.document.description?.length || 0;
  }

  isCharacterLimitExceeded(): boolean {
    return this.getCharacterCount() > 500;
  }

  // Validation helpers
  isFormValid(form: NgForm): boolean {
    return form.valid && !this.isCharacterLimitExceeded();
  }

  getFormErrors(form: NgForm): string[] {
    const errors: string[] = [];
    
    if (form.controls['name']?.invalid) {
      errors.push('Product name is required');
    }
    
    if (form.controls['url']?.invalid) {
      errors.push('Valid product URL is required');
    }
    
    if (this.isCharacterLimitExceeded()) {
      errors.push('Description exceeds maximum length');
    }
    
    return errors;
  }
}