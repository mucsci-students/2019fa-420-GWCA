//angular imports
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


//components
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NewButtonComponent } from './new-button/new-button.component';
import { EditButtonComponent } from './edit-button/edit-button.component';
import { ImportButtonComponent } from './import-button/import-button.component';
import { ExportButtonComponent } from './export-button/export-button.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DialogTestComponent } from './dialog-test/dialog-test.component';
import { ClassBoxComponent } from './class-box/class-box.component';
import { CreateButtonTestComponent } from './create-button-test/create-button-test.component';
import { ClassAreaComponent } from './class-area/class-area.component';


//services
import { StorageService } from './storage.service';


//material imports
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule, MatSelectModule } from '@angular/material';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [
    AppComponent,
    NewButtonComponent,
    EditButtonComponent,
    ImportButtonComponent,
    ExportButtonComponent,
    DialogTestComponent,
    ClassBoxComponent,
    CreateButtonTestComponent,
    ClassAreaComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatDialogModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatSelectModule,
  ],
  entryComponents: [
    DialogTestComponent,
    ClassBoxComponent,
  ],
  providers: [StorageService],
  bootstrap: [AppComponent]
})
export class AppModule { }
