import { Component, OnInit, ViewContainerRef,ViewChild,ComponentFactoryResolver, IterableDiffer, IterableDiffers, SimpleChanges, KeyValueDiffers, OnChanges, DoCheck, AfterViewInit, AfterViewChecked, AfterContentInit } from '@angular/core';
import { ClassBoxComponent } from '../class-box/class-box.component';
import { ClassStorageService } from '../class-storage.service';
import { DialogTestComponent } from '../dialog-test/dialog-test.component';
import { MatDialogRef, MatDialog } from '@angular/material';
import { jsPlumb } from 'jsplumb';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Router, NavigationEnd, NavigationStart } from '@angular/router';

@Component({
  selector: 'app-class-area',
  templateUrl: './class-area.component.html',
  styleUrls: ['./class-area.component.css']
})
export class ClassAreaComponent implements OnInit, DoCheck, AfterViewInit {
  switchToCLI: boolean;
 
  //NOTE: this is testing, ignore for now

  @ViewChild('container',{static:true,read: ViewContainerRef}) ref;
  //listen for changes in arrays (insertions / deletions)
  private iterableDiffer: IterableDiffer<object>;
  constructor(private resolver: ComponentFactoryResolver,public service: ClassStorageService
    ,public dialog: MatDialog, private iterableDiffs: IterableDiffers,
    private router: Router) {
      this.iterableDiffer= this.iterableDiffs.find([]).create(null);


      router.events.subscribe(event  => {
        if(event instanceof NavigationEnd){
          this.switchToCLI = true;
        }

        if(event instanceof NavigationStart){
          if(router.url !== '/cli'){
            //find all classes in the DOM and then iterate through all of them and add connections to the back-end
            var elements = document.querySelectorAll('.class-box');
            for(var i = 0;i< elements.length;i++){
              var connections = this.service.jsPlumbInstance.getConnections({source: elements[i].id});
              for(var j = 0;j<connections.length;j++){
                if(connections[j]['source']['attributes']['id'].value !== connections[j]['target']['attributes']['id'].value){
                  this.updateConnections(connections[j]['source']['attributes']['id'].value,connections[j]['target']['attributes']['id'].value);
                }
              }
            }
            this.removeAll();

          }
        }
        });
     }


  ngOnInit() {
  }

  //listen for insertion into array of "classes" and on insert create the class
  ngDoCheck(){
    let changes = this.iterableDiffer.diff(this.service.allClasses);
    if(changes){
        changes.forEachAddedItem(r =>
           this.updateBackend()
        );
    }
  }



  removeAll(){
    var classes = document.querySelectorAll(".class-box");
    for(var i = 0;i<classes.length;i++){
      this.service.jsPlumbInstance.remove(classes[i]['id']);
    }
   
  }


  //update backend
  updateBackend(){
    if(this.switchToCLI === false){
      this.createClass();
      this.service.pruneArray();
    }
    this.service.currentContainerIndex = this.service.currentContainerIndex + 1;
  }

  //find the class in the back-end array and add the connection
  updateConnections(source:string, target: string){
    var connections = this.service.findClass(source)['connections'];
    if(connections.length == 1){
      if(connections[0] !== [source,target]){
        this.service.findClass(source)['connections'].push([source,target]);
      }
    }
    else{
      for(var i = 0; i< connections.length;i++){
        if(connections[i] == [source,target]){
          return;
        }
      }
      this.service.findClass(source)['connections'].push([source,target]);
    }
  }

  //set up jsplumb instance after the view has initialized
  ngAfterViewInit(){
    this.service.jsPlumbInstance = jsPlumb.getInstance();
    this.service.jsPlumbInstance.setContainer("classes-container");
    this.removeAll();

  }


  //dialog
  public dialogRef: MatDialogRef<DialogTestComponent>
  openDialog(buttonName){
    this.switchToCLI = false;
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
        this.dialogRef.componentInstance.name = "Delete Class";
        break;
      case 'delete_attribute':
        this.dialogRef.componentInstance.buttonPressed = "delete_attribute";
        this.dialogRef.componentInstance.name = "Delete Attribute";
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
    //listen for close without submit
    this.dialogRef.backdropClick().subscribe(() => {
      this.switchToCLI = true;
    });
    //listen for normal close
    this.dialogRef.afterClosed().subscribe(() => {
      this.switchToCLI = true;
    });
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
      this.switchToCLI = true;
  }

  drop(event: CdkDragDrop<ClassBoxComponent[]>){
    moveItemInArray(this.classBoxes,event.previousIndex,event.currentIndex);
  }

  updateStoredDiagram(){
    this.service.diagramToJSON();
  }  
}
