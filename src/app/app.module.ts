import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header.component';


import { DocumentsComponent } from './documents/documents.component';
import { DocumentDetailComponent } from './documents/document-detail/document-detail.component'
import { DocumentItemComponent } from './documents/document-item/document-item.component'
import { DocumentListComponent } from './documents/document-list/document-list.component';
import { DropdownDirective } from './shared/dropdown.directive';
import { AppRoutingModule } from './app-routing.module';
import { DocumentEditComponent } from './documents/document-edit/document-edit.component';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    DocumentsComponent,
    DocumentDetailComponent,
    DocumentItemComponent,
    DocumentListComponent,
    DropdownDirective,
    DocumentEditComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
