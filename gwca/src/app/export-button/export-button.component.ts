import { Component, OnInit } from '@angular/core';
import { MatDialog,MatDialogRef } from '@angular/material/dialog';
import { DialogTestComponent } from '../dialog-test/dialog-test.component';

@Component({
  selector: 'app-export-button',
  templateUrl: './export-button.component.html',
  styleUrls: ['./export-button.component.css']
})
export class ExportButtonComponent implements OnInit {

  constructor(public dialog: MatDialog) { }

  ngOnInit() {
  }

  public dialogRef: MatDialogRef<DialogTestComponent>
  openDialog(){
    //insert component here to generate and remove component
    this.dialogRef = this.dialog.open(DialogTestComponent, {width: '250px'});
    this.dialogRef.componentInstance.name = "Export Button";
  }

}
