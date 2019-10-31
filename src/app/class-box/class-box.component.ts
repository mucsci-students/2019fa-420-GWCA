import { Component, OnInit, AfterViewInit, IterableDiffer, IterableDiffers, DoCheck, AfterViewChecked} from '@angular/core';
import { ClassStorageService} from '../class-storage.service';
import { MatDialog, MatDialogRef } from '@angular/material';
import { DialogTestComponent } from '../dialog-test/dialog-test.component';
import { Router } from '@angular/router';


@Component({
  selector: 'app-class-box',
  templateUrl: './class-box.component.html',
  styleUrls: ['./class-box.component.css']
})
export class ClassBoxComponent implements OnInit, AfterViewInit,DoCheck, AfterViewChecked {
  name: string;
  variables: string[];
  editorVariables: string;
  methods: string[];
  editorMethods: string;
  id: string;
  index: number = 0;
  dialogRef: MatDialogRef<DialogTestComponent>;
  connectionType: string;
  private iterableDiffer: IterableDiffer<object>;
  //help choose what to edit
  edit: string;


  constructor(public classService: ClassStorageService, public dialog: MatDialog,
    private iterableDiffs: IterableDiffers, public router: Router) { 
      this.iterableDiffer= this.iterableDiffs.find([]).create(null);

  }

  ngOnInit() {
    this.edit = '';
    for(var i = this.classService.allClasses.length-1;i>0;i--){
      var test = document.getElementsByClassName(this.classService.allClasses[i]['name']);
      if(test.length == 0){
        this.index = i;
        break;
      }
    }
    this.name = this.classService.allClasses[this.index]['name'];
    this.id = this.name + "_" + this.classService.instance;
    this.variables = this.classService.allClasses[this.index]['variables'];
    this.methods = this.classService.allClasses[this.index]['methods'];
    this.classService.instance = this.classService.instance + 1;



  }

  
  ngDoCheck(){
    let changes = this.iterableDiffer.diff(this.classService.allClasses);
    if(changes){
        changes.forEachAddedItem(r =>
           this.updateValues()
        );

    }
  }

  ngAfterViewInit(){
    var jsPlumbInstance = this.classService.jsPlumbInstance;
       

     //get all the dynamically created elements
     var boxes = document.querySelectorAll("app-class-box");


     //keep track of the top shift value
     var topShift  = 20;
     for(var i = 0;i<boxes.length;i++){
      if(this.classService.leftShift > 900){
        this.classService.leftShift = 20;
        topShift = topShift + 300;
      }
        (<HTMLElement>boxes[i]).style.left = this.classService.leftShift + 'px';
        (<HTMLElement>boxes[i]).style.top = topShift + 'px';
        this.classService.leftShift = this.classService.leftShift + 300;
     }

    var jsPlumbInstance = this.classService.jsPlumbInstance;
    //note this is kind of a hacky solution...

    this.classService.addEndpoints(this.id);

     //this.classService.jsPlumbInstance.addEndpoint(this.id,{anchor: ["Right","Continuous"],uuid:(this.id+"_right")},this.classService.common);
     //this.classService.jsPlumbInstance.addEndpoint(this.id,{anchor: ["Top","Continuous"],uuid:(this.id+"_top")},this.classService.common);
     //this.classService.jsPlumbInstance.addEndpoint(this.id,{anchor: ["Left","Continuous"],uuid:(this.id+"_left")},this.classService.common);
 
    setTimeout(() =>
    this.classService.jsPlumbInstance.draggable(this.id,{
      drag:function(event){
        jsPlumbInstance.repaintEverything();
      },zIndex: 1000
    }), 
    100);


    //have to create local variables for jsplumb
    var dialog = this.dialog;
    var dialogRef = this.dialogRef;
    var connectionType;;
    var id = this.id;

    //no self connections
    jsPlumbInstance.bind("connection",function(){
      var connections = jsPlumbInstance.getConnections(this.id);
      //remove self connections
        if(connections[(connections.length - 1)]['source']['id'] == connections[(connections.length - 1)]['target']['id']){
          jsPlumbInstance.deleteConnection(connections[(connections.length - 1)]);
        }
        //otherwise open dialog so we can specify connection type
        else{
          if(id == connections[(connections.length - 1)]['source']['id']){
            dialogRef = dialog.open(DialogTestComponent, {width: '250px'});
            dialogRef.componentInstance.buttonPressed = "connection";
            dialogRef.afterClosed().subscribe(() => {
              connectionType = dialogRef.componentInstance.connectionType;
              switch(connectionType){
                //open diamond, solid line
                //aggregation
                case 'purple':
                  connections[(connections.length - 1)].removeAllOverlays();
                  connections[(connections.length - 1)].setPaintStyle({stroke: 'purple', lineWidth: '10px'});
                  connections[(connections.length - 1)].addOverlay(["Label",{label:"Aggregation",location:0.5}]);
                  connections[(connections.length - 1)].addOverlay(["Diamond",{
                    cssClass: "unfilledDiamond",
                    width: 15,
                    length: 30,
                    location: 1
                  }]);
                  break;
                //association
                //just a line
                case 'green':
                  connections[(connections.length - 1)].removeAllOverlays();
                  connections[(connections.length - 1)].setPaintStyle({stroke: 'green', lineWidth: '10px'});
                  connections[(connections.length - 1)].addOverlay(["Label",{label:"Association",location:0.5}]);
                  break;
                //closed diamond, solid line
                //composition
                case 'red':
                  connections[(connections.length - 1)].removeAllOverlays();
                  connections[(connections.length - 1)].setPaintStyle({stroke: 'red', lineWidth: '10px'});
                  connections[(connections.length - 1)].addOverlay(["Label",{label:"Composition",location:0.5}]);
                  connections[(connections.length - 1)].addOverlay(["Diamond", {width: 15,length: 30,location: 1}]);
                  break;
                //closed arrow, solid line
                //generalization
                case 'orange':
                  connections[(connections.length - 1)].setPaintStyle({stroke: 'orange', lineWidth: '10px'});
                  connections[(connections.length - 1)].addOverlay(["Label",{label:"Generalization",location:0.5}]);
                  break;
                //closed arrow, dashed line
                //realization
                case 'yellow':
                  connections[(connections.length - 1)].setPaintStyle({"dashstyle":'3 3',stroke:'yellow',strokeWidth:5});
                  connections[(connections.length - 1)].addOverlay(["Label",{label:"Realization",location:0.5}]);
                  break;
              }
            });
          }
        }

        
      });
  }

  ngAfterViewChecked(){
    var editBox = document.querySelector('.editor');
    if(editBox != undefined){
      var classBox = document.querySelector('.'+this.name);
      var y = (<HTMLElement>classBox).style.top;
      var x = (<HTMLElement>classBox).style.left;
      if(this.edit == 'variables'){
        (<HTMLElement>editBox).style.top = (parseInt(y.split("p")[0]) + 50) + 'px';
        
      }
      else if(this.edit == 'methods'){
        (<HTMLElement>editBox).style.top = (parseInt(y.split("p")[0]) + 130) + 'px';
      }
      (<HTMLElement>editBox).style.left = (parseInt(x.split("p")[0]) + 10) + 'px';
      (<HTMLElement>editBox).style.width = '230px';
    }
  }

  pullVariables(){
    this.editorVariables = this.variables.join(",");
    this.edit = 'variables';
    //this.classService.jsPlumbInstance.repaintEverything();
  }

  pullMethods(){
    this.editorMethods = this.methods.join(",");
    this.edit = 'methods';
    //this.classService.jsPlumbInstance.repaintEverything();
  }

  //editor change
  editVariables(){
    this.classService.findClass(this.name)['variables'] = this.editorVariables.split(",");
    this.updateValues();
    this.edit = '';
    this.classService.jsPlumbInstance.repaintEverything();
  }

  editMethods(){
    this.classService.findClass(this.name)['methods'] = this.editorMethods.split(",");
    this.updateValues();
    this.edit = '';
    this.classService.jsPlumbInstance.repaintEverything();    
  }

  //tracker methods for ngFor
  trackVariables(){
    return this.variables;
  }

  trackMethods(){
    return this.methods;
  }

  //update values on edit
  updateValues(){
    var cls = this.classService.findClass(this.name);
    this.variables = cls['variables'];
    this.methods = cls['methods'];

  }
}
