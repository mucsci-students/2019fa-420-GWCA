import { Component, ViewChild, ViewContainerRef } from '@angular/core';
import { MatDialog,MatDialogRef } from '@angular/material/dialog';
import { DialogTestComponent } from '../dialog-test/dialog-test.component';
import { ClassStorageService } from './class-storage.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})

export class AppComponent {
  title = 'gwca';

  @ViewChild('container',{static: false}) rf: ViewContainerRef;

  constructor(public dialog: MatDialog, public service: ClassStorageService){

  }

  public dialogRef: MatDialogRef<DialogTestComponent>
  openDialog(){
    //insert component here to generate and remove component
    this.dialogRef = this.dialog.open(DialogTestComponent, {width: '250px'});
    this.dialogRef.componentInstance.name = "Export Button";
    this.dialogRef.componentInstance.buttonPressed = "export";

  }
}
