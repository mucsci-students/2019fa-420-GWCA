import { Component, OnInit,ComponentFactoryResolver, IterableDiffer, IterableDiffers, DoCheck, AfterViewInit, OnDestroy, NgZone } from '@angular/core';
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
  //generate components (new way) in the view
  classBoxes = [];
 
  //NOTE: this is testing, ignore for now
  //listen for changes in arrays (insertions / deletions)
  private iterableDiffer: IterableDiffer<object>;
  constructor(private resolver: ComponentFactoryResolver,public service: ClassStorageService
    ,public dialog: MatDialog, private iterableDiffs: IterableDiffers,
    private router: Router) {
      this.iterableDiffer= this.iterableDiffs.find([]).create(null);


      router.events.subscribe(event  => {
        if(event instanceof NavigationEnd){
          // this.switchToCLI = true;
          if(router.url == '/'){

          }

        }

        if(event instanceof NavigationStart){
          if(router.url !== '/cli'){
            this.service.connectionsUpdateWrapper();
            this.updatePosition();
            //this.removeAll();
            // this.classBoxes = [];

          }
        }
        });
     }


  ngOnInit() {
    this.classBoxes = [];
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


  //set up jsplumb instance after the view has initialized
  ngAfterViewInit(){

    this.service.jsPlumbInstance = jsPlumb.getInstance({
      DragOptions: {
        zIndex: 1000
      },
    });
    this.service.jsPlumbInstance.setContainer("classes-container");
    this.service.jsPlumbInstance.reset();
    this.service.revertLeftShift();


    
    
    var classes = this.service.allClasses;

    //empty back-end for re-insertion



    if(classes.length != 0){
      
      for(var i=0;i<classes.length;i++){
        //redraw position if previously placed
        if(classes[i]['position'].length != 0){
          var class_box = document.querySelector('.'+classes[i]['name']);
          //redraw position
          (<HTMLElement>class_box).style.left = classes[i]['position'][0];
          (<HTMLElement>class_box).style.top = classes[i]['position'][1];
        }
        this.service.reinitializeConnections();
      }
    }

  }


  







  //update backend
  updateBackend(){
    //console.log(this.service.generate());
    var generated = document.getElementsByClassName(this.service.generate().name);
    if(generated.length == 0){
      this.createClass();
      this.service.pruneArray();

    }
  }

  

  updatePosition(){
    var classes = document.querySelectorAll('.class-box');
     for(var i = 0;i<classes.length;i++){
      var cls = this.service.findClass(classes[i]['attributes'][3].value);
      this.service.setPosition(cls,(<HTMLElement>classes[i]).style['left'],(<HTMLElement>classes[i]).style['top']);
     }

  }
  



  //dialog
  public dialogRef: MatDialogRef<DialogTestComponent>
  openDialog(buttonName){
    this.switchToCLI = false;
    //insert component here to generate and remove component
    this.dialogRef = this.dialog.open(DialogTestComponent, {width: '30%'});

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
        case 'help':
          //update width for help
          this.dialogRef.updateSize('50%','80%');
          this.dialogRef.componentInstance.buttonPressed = "help";
          this.dialogRef.componentInstance.name = "Help";
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

  updateStoredDiagram(){
    this.service.diagramToJSON();
  }
  
  /*test(){
    this.service.deleteClass('a_0', 'a');
  }*/
}
