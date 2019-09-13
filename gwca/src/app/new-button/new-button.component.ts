import { Component, OnInit } from '@angular/core';
import {MatDialog,MatDialogRef,} from '@angular/material/dialog';
import { DialogTestComponent } from '../dialog-test/dialog-test.component';

@Component({
  selector: 'app-new-button',
  templateUrl: './new-button.component.html',
  styleUrls: ['./new-button.component.css']
})
export class NewButtonComponent implements OnInit {

  constructor(public dialog: MatDialog) { }

  ngOnInit() {
  }

  public dialogRef: MatDialogRef<DialogTestComponent>
  openDialog(){
    //insert component here to generate and remove component
    const dialogRef = this.dialog.open(DialogTestComponent, {width: '250px'});
  }
}
