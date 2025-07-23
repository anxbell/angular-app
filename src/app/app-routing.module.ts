import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DocumentsComponent } from './documents/documents.component';

import { DocumentDetailComponent } from './documents/document-detail/document-detail.component';
import { DocumentEditComponent } from './documents/document-edit/document-edit.component';



const appRoutes: Routes = [
  { path: '', redirectTo: '/documents', pathMatch: 'full' },
  { 
    path: 'documents', component: DocumentsComponent, 
      children: [
        { path: 'new', component: DocumentEditComponent },
        { path: ':id', component: DocumentDetailComponent },
        { path: ':id/edit', component: DocumentEditComponent }
      ]
  },


];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
