import { Component, Input } from '@angular/core';
import { Document } from '../document.model';

@Component({
  selector: 'cms-document-item',
  standalone: false,
  templateUrl: './document-item.component.html',
  styleUrls: ['./document-item.component.css']
})
export class DocumentItemComponent {
  @Input() document: Document = {
    id: '1',
    name: 'Sample Document',
    description: 'This is a sample document description.',
    url: 'https://example.com/sample-document.pdf',
    children: []
  };
}
