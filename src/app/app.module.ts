//angular imports
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
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
import { MatInputModule, MatSelectModule, MatMenuModule, MatToolbarModule, MatChipsModule } from '@angular/material';
import { MatIconModule } from '@angular/material/icon';

import { CliComponent } from './cli/cli.component';
import { NgTerminalModule, NgTerminalComponent } from 'ng-terminal';

import { DragDropModule } from '@angular/cdk/drag-drop';
import { ObserversModule } from '@angular/cdk/observers';


@NgModule({
  declarations: [
    AppComponent,
    DialogTestComponent,
    ClassBoxComponent,
    ClassAreaComponent,
    CliComponent,

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
    DragDropModule,
    ObserversModule,
    NgTerminalModule,
    MatMenuModule,
    MatToolbarModule,
    MatChipsModule
  ],
  entryComponents: [
    DialogTestComponent,
    ClassBoxComponent,
  ],
  providers: [
    ClassStorageService,
    ClassAreaComponent,
    ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  exports: [ NgTerminalComponent ]
})
export class AppModule { }
