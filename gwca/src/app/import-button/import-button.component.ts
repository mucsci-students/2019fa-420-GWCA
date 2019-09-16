import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DialogTestComponent } from '../dialog-test/dialog-test.component';


@Component({
  selector: 'app-import-button',
  templateUrl: './import-button.component.html',
  styleUrls: ['./import-button.component.css']
})
export class ImportButtonComponent implements OnInit {

  constructor(public dialog: MatDialog) { }

  ngOnInit() {
  }

  public dialogRef: MatDialogRef<DialogTestComponent>
  openDialog(){
    //insert component here to generate and remove component
    this.dialogRef = this.dialog.open(DialogTestComponent, {width: '250px'});
    this.dialogRef.componentInstance.name = "Import Button";
    this.dialogRef.componentInstance.buttonPressed = "import";

  }

}
