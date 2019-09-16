import { Component, OnInit, NgModule } from '@angular/core';
import {MatDialog,MatDialogRef} from '@angular/material/dialog';
import { DialogTestComponent } from '../dialog-test/dialog-test.component';




@Component({
  selector: 'app-edit-button',
  templateUrl: './edit-button.component.html',
  styleUrls: ['./edit-button.component.css']
})
export class EditButtonComponent implements OnInit {
  
  constructor(public dialog: MatDialog) { }

  ngOnInit() {
  }

  public dialogRef: MatDialogRef<DialogTestComponent>
  openDialog(){
    //insert component here to generate and remove component
    this.dialogRef = this.dialog.open(DialogTestComponent, {width: '250px'});
    this.dialogRef.componentInstance.name = "Edit Button";
    this.dialogRef.componentInstance.buttonPressed = "edit";
  }
}
