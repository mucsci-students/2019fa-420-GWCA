import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NewButtonComponent } from './new-button/new-button.component';
import { EditButtonComponent } from './edit-button/edit-button.component';
import { ImportButtonComponent } from './import-button/import-button.component';
import { ExportButtonComponent } from './export-button/export-button.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

//material imports
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { DialogTestComponent } from './dialog-test/dialog-test.component';

@NgModule({
  declarations: [
    AppComponent,
    NewButtonComponent,
    EditButtonComponent,
    ImportButtonComponent,
    ExportButtonComponent,
    DialogTestComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatDialogModule,
  ],
  entryComponents: [DialogTestComponent],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
