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

  onImageError(event: any) {
    // Set a fallback image or emoji if the image fails to load
    event.target.style.display = 'none';
    event.target.parentElement.innerHTML = '<div style="font-size: 2.5rem; text-align: center;">👓</div>';
  }
}