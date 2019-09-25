//angular imports
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


//components
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DialogTestComponent } from './dialog-test/dialog-test.component';
import { ClassBoxComponent } from './class-box/class-box.component';
import { ClassAreaComponent } from './class-area/class-area.component';


//services
//import { StorageService } from './storage.service';
import { ClassStorageService } from './class-storage.service'

//material imports
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule, MatSelectModule } from '@angular/material';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    DialogTestComponent,
    ClassBoxComponent,
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
    FormsModule,
  ],
  entryComponents: [
    DialogTestComponent,
    ClassBoxComponent,
  ],
  providers: [
    ClassStorageService,
    ClassAreaComponent,
    ],
  bootstrap: [AppComponent]
})
export class AppModule { }
