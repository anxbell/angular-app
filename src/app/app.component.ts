import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css'
})
export class AppComponent {
  // selectedFeature = 'documents';

  // ngOnInit(): void {
  //   const savedFeature = localStorage.getItem('selectedFeature');
  //   if (savedFeature) {
  //     this.selectedFeature = savedFeature;
  //   }
  // }

  // switchView(feature: string) {
  //   this.selectedFeature = feature;
  //   localStorage.setItem('selectedFeature', feature);
  //   console.log('Switched to:', feature);
  // }
}

