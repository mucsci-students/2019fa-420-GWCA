import { Component, OnInit, ViewContainerRef,ViewChild,ComponentFactoryResolver, IterableDiffer, IterableDiffers, SimpleChanges, KeyValueDiffers, OnChanges, DoCheck, AfterViewInit, AfterViewChecked, AfterContentInit } from '@angular/core';
import { ClassBoxComponent } from '../class-box/class-box.component';
import { ClassStorageService } from '../class-storage.service';
import { DialogTestComponent } from '../dialog-test/dialog-test.component';
import { MatDialogRef, MatDialog } from '@angular/material';
import { jsPlumb } from 'jsplumb';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-class-area',
  templateUrl: './class-area.component.html',
  styleUrls: ['./class-area.component.css']
})
export class ClassAreaComponent implements OnInit, DoCheck, AfterViewInit {

  //NOTE: this is testing, ignore for now

  @ViewChild('container',{static:true,read: ViewContainerRef}) ref;
  //listen for changes in arrays (insertions / deletions)
  private iterableDiffer: IterableDiffer<object>;
  constructor(private resolver: ComponentFactoryResolver,public service: ClassStorageService
    ,public dialog: MatDialog, private iterableDiffs: IterableDiffers) {
      this.iterableDiffer= this.iterableDiffs.find([]).create(null);
     }


  ngOnInit() {
  }

  //listen for insertion into array of "classes" and on insert create the class
  ngDoCheck(){
    let changes = this.iterableDiffer.diff(this.service.allClasses);
    if(changes){
        changes.forEachAddedItem(r =>
           this.createClass()
          );
        changes.forEachAddedItem(a =>
          this.service.pruneArray()
        );
    }
  }


  //set up jsplumb instance after the view has initialized
  ngAfterViewInit(){
    this.service.jsPlumbInstance = jsPlumb.getInstance();
  }

  //for direct connections in jsplumb
  connectElements(el1: string,el2: string){
    this.service.jsPlumbInstance.connect({
      source: el1,
      target: el2
    });
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
        case 'delete':
          this.dialogRef.componentInstance.buttonPressed = "delete";
          this.dialogRef.componentInstance.name = "Delete Button";
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
  
  //generate components (new way) in the view
  classBoxes = [];

  createClass(){
     const factory = this.resolver.resolveComponentFactory(ClassBoxComponent);
    //  const temp = this.ref.createComponent(factory);
    //  temp.instance.name = this.service.generate().name;
    //  temp.instance.methods = this.service.generate().methods;
    //  temp.instance.variables = this.service.generate().variables;
     this.classBoxes.push(factory);
  }

  drop(event: CdkDragDrop<ClassBoxComponent[]>){
    moveItemInArray(this.classBoxes,event.previousIndex,event.currentIndex);
  }


}
