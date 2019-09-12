import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NewButtonComponent } from './new-button/new-button.component';
import { EditButtonComponent } from './edit-button/edit-button.component';
import { ImportButtonComponent } from './import-button/import-button.component';
import { ExportButtonComponent } from './export-button/export-button.component';

@NgModule({
  declarations: [
    AppComponent,
    NewButtonComponent,
    EditButtonComponent,
    ImportButtonComponent,
    ExportButtonComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
