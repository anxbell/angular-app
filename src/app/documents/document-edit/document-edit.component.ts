import { Component, OnInit } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
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
  document: Document = new Document('', '', '', '', []);
  editMode: boolean = false;

  constructor(
    private documentService: DocumentService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(
      (params: Params) => {
        const id = params['id'];
        if (!id) {
          this.editMode = false;
          // Crear documento vacío para modo agregar
          this.document = new Document('', '', '', '', []);
          return;
        }
        
        this.originalDocument = this.documentService.getDocument(id);
        if (!this.originalDocument) {
          // Si no encuentra el documento, redirigir
          this.router.navigate(['/documents']);
          return;
        }
        
        this.editMode = true;
        // Crear copia profunda del documento original
        this.document = JSON.parse(JSON.stringify(this.originalDocument));
      }
    );
  }

  onCancel() {
    this.router.navigate(['/documents']);
  }

  onSubmit(form: NgForm) {
    
    if (!form.valid) {
      console.log('Form is invalid, not submitting');
      return;
    }

    const value = form.value;
    const newDocument = new Document(
      '',
      value.name || '', 
      value.description || '', 
      value.url || '', 
      []
    );
    
    console.log('New document to save:', newDocument);
    
    try {
      if (this.editMode && this.originalDocument) {
        console.log('Updating existing document');
        this.documentService.updateDocument(this.originalDocument, newDocument);
      } else {
        console.log('Adding new document');
        this.documentService.addDocument(newDocument);
      }
      
      console.log('Document operation completed, navigating...');
      this.router.navigate(['/documents']);
      
    } catch (error) {
      console.error('Error saving document:', error);
    }
  }
}