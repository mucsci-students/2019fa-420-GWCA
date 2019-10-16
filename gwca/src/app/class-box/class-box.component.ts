import { Component, OnInit, AfterViewInit, EventEmitter} from '@angular/core';
import { ClassStorageService } from '../class-storage.service';
import { jsPlumb } from 'jsplumb';
import { MatDialog, MatDialogRef } from '@angular/material';
import { DialogTestComponent } from '../dialog-test/dialog-test.component';




@Component({
  selector: 'app-class-box',
  templateUrl: './class-box.component.html',
  styleUrls: ['./class-box.component.css']
})
export class ClassBoxComponent implements OnInit, AfterViewInit {
  name: string;
  variables: string[];
  methods: string[];
  id: string;
  index: number = 0;
  dialogRef: MatDialogRef<DialogTestComponent>;
  connectionType: string;


  constructor(private classService: ClassStorageService, public dialog: MatDialog) { 
  }

  ngOnInit() {
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

    this.classService.jsPlumbInstance.addEndpoint(this.id,{anchor: "Bottom",uuid:(this.id+"_bottom")},this.classService.common);
    this.classService.jsPlumbInstance.addEndpoint(this.id,{anchor: "Right",uuid:(this.id+"_right")},this.classService.common);
    this.classService.jsPlumbInstance.addEndpoint(this.id,{anchor: "Top",uuid:(this.id+"_top")},this.classService.common);
    this.classService.jsPlumbInstance.addEndpoint(this.id,{anchor: "Left",uuid:(this.id+"_left")},this.classService.common);
    setTimeout(() =>
    this.classService.jsPlumbInstance.draggable(this.id), 
    100);


    //have to create local variables for jsplumb
    var dialog = this.dialog;
    var dialogRef = this.dialogRef;
    var connectionType;;
    var id = this.id;

    //no self connections
    jsPlumbInstance.bind("connection",function(){
      var connections = jsPlumbInstance.getConnections(this.id);
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
              connections[(connections.length - 1)].setPaintStyle({stroke: connectionType, lineWidth: '10px'});
            });
          }
        }

        
      });




   
  }






  // public dialogRef: MatDialogRef<DialogTestComponent>
  // openDialog(){
  //   //insert component here to generate and remove component
  //   this.dialogRef = this.dialog.open(DialogTestComponent, {width: '250px'});
  //   this.dialogRef.componentInstance.buttonPressed = "connection";
  // }


}
