import { Component, OnInit, ViewContainerRef,ViewChild,ComponentFactoryResolver, IterableDiffer, IterableDiffers, SimpleChanges, KeyValueDiffers, OnChanges } from '@angular/core';
import { ClassBoxComponent } from '../class-box/class-box.component';
import { ClassStorageService } from '../class-storage.service';
import { DialogTestComponent } from '../dialog-test/dialog-test.component';
import { MatDialogRef, MatDialog } from '@angular/material';

@Component({
  selector: 'app-class-area',
  templateUrl: './class-area.component.html',
  styleUrls: ['./class-area.component.css']
})
export class ClassAreaComponent implements OnInit {

  @ViewChild('container',{static:true,read: ViewContainerRef}) ref;
  
  constructor(private resolver: ComponentFactoryResolver,public service: ClassStorageService
    ,public dialog: MatDialog) {
     }


  ngOnInit() {
  }

  //dialog
  public dialogRef: MatDialogRef<DialogTestComponent>
  openDialog(buttonName){
    //insert component here to generate and remove component
    this.dialogRef = this.dialog.open(DialogTestComponent, {width: '250px'});

    switch(buttonName){
      case 'new':
        this.dialogRef.componentInstance.buttonPressed = "new";
        this.dialogRef.componentInstance.name = "New Button";
        break;
      case 'edit':
        this.dialogRef.componentInstance.buttonPressed = "edit";
        this.dialogRef.componentInstance.name = "Edit Button";
        break;
      case 'import':
        this.dialogRef.componentInstance.buttonPressed = "import";
        this.dialogRef.componentInstance.name = "Import Button";
        break;
      case 'export':
        this.dialogRef.componentInstance.buttonPressed = "export";
        this.dialogRef.componentInstance.name = "Export Button";
        break;
    }
  }
  
  closeDialog(){
    this.dialogRef.close(this.createClass());
  }
  



  createClass(){
    const factory = this.resolver.resolveComponentFactory(ClassBoxComponent);
    const temp = this.ref.createComponent(factory);
    temp.instance.name = this.service.generate().name;
    temp.instance.methods = this.service.generate().methods;
    temp.instance.variables = this.service.generate().variables;
    //shift to end
    this.service.allClasses.push(this.service.allClasses[0]);
    this.service.allClasses.shift();
  }

  test(){
    console.log("TEST");
  }
}
