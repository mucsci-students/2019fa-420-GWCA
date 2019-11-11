import { Component, OnInit, AfterViewInit, IterableDiffer, IterableDiffers, DoCheck, AfterViewChecked} from '@angular/core';
import { ClassStorageService} from '../class-storage.service';
import { MatDialog, MatDialogRef } from '@angular/material';
import { DialogTestComponent } from '../dialog-test/dialog-test.component';

@Component({
  selector: 'app-class-box',
  templateUrl: './class-box.component.html',
  styleUrls: ['./class-box.component.css']
})
export class ClassBoxComponent implements OnInit, AfterViewInit,DoCheck, AfterViewChecked {
  name: string;
  editorName: string;
  variables: string[];
  editorVariables: string;
  methods: string[];
  editorMethods: string;
  exists: boolean;
  id: string;
  index: number = 0;
  dialogRef: MatDialogRef<DialogTestComponent>;
  connectionType: string;
  private iterableDiffer: IterableDiffer<object>;
  //help choose what to edit
  edit: string;


  constructor(public service: ClassStorageService, public dialog: MatDialog,
    private iterableDiffs: IterableDiffers) { 
      this.iterableDiffer= this.iterableDiffs.find([]).create(null);

  }

  ngOnInit() {
    this.exists = true;
    this.edit = '';
    for(var i = this.service.allClasses.length-1;i>0;i--){
      var test = document.getElementsByClassName(this.service.allClasses[i]['name']);
      if(test.length == 0){
        this.index = i;
        break;
      }
    }
    this.name = this.service.allClasses[this.index]['name'];
    this.id = this.name + "_" + this.service.instance;
    this.variables = this.service.allClasses[this.index]['variables'];
    this.methods = this.service.allClasses[this.index]['methods'];
    this.service.instance = this.service.instance + 1;



  }

  
  ngDoCheck(){
    let changes = this.iterableDiffer.diff(this.service.allClasses);
    if(changes){
        changes.forEachAddedItem(r =>
           this.updateValues()
        );

    }
  }

  ngAfterViewInit(){
    var jsPlumbInstance = this.service.jsPlumbInstance;
       

     //get all the dynamically created elements
     var boxes = document.querySelectorAll("app-class-box");


     //keep track of the top shift value
     var topShift  = 20;
     for(var i = 0;i<boxes.length;i++){
      if(this.service.leftShift > 900){
        this.service.leftShift = 20;
        topShift = topShift + 300;
      }
        (<HTMLElement>boxes[i]).style.left = this.service.leftShift + 'px';
        (<HTMLElement>boxes[i]).style.top = topShift + 'px';
        this.service.leftShift = this.service.leftShift + 300;
     }

    var jsPlumbInstance = this.service.jsPlumbInstance;
    //note this is kind of a hacky solution...

    this.service.addEndpoints(this.id);

    var id = this.id;

 
    setTimeout(() =>
    this.service.jsPlumbInstance.draggable(this.id,{
      drag:function(event){
        jsPlumbInstance.revalidate(id);
        jsPlumbInstance.repaintEverything();
        //line overlap algorithm
        var sourceConnections = jsPlumbInstance.getConnections({source: id});
        var targetConnections = jsPlumbInstance.getConnections({target: id});
        if(sourceConnections.length > 0){
          for(var i =0;i<sourceConnections.length;i++){
            var source = sourceConnections[i]['source'];
            var target = sourceConnections[i]['target'];
            var connection = sourceConnections[i]['canvas'].getBoundingClientRect();
            var classBoxes = document.querySelectorAll('.class-box');
            for(var j = 0;j<classBoxes.length;j++){
              var classBox = classBoxes[j].getBoundingClientRect();
              var overlap = !(connection.right < classBox.left || connection.left > classBox.right || connection.bottom < classBox.top || connection.top > classBox.bottom);
              if(!overlap && classBoxes[j] != source && classBoxes[j] != target){
                (<HTMLElement>classBoxes[j]).style.top = (connection.top + connection.height + 20) + 'px';
                jsPlumbInstance.repaintEverything();
              }
            }
          }
        }
        if(targetConnections.length > 0){
          for(var i =0;i<targetConnections.length;i++){
          var source = targetConnections[i]['source'];
          var target = targetConnections[i]['target'];
          var connection = targetConnections[i]['canvas'].getBoundingClientRect();
          var classBoxes = document.querySelectorAll('.class-box');
          for(var j = 0;j<classBoxes.length;j++){
            var classBox = classBoxes[j].getBoundingClientRect();
            var overlap = !(connection.right < classBox.left || connection.left > classBox.right || connection.bottom < classBox.top || connection.top > classBox.bottom);
            if(!overlap && classBoxes[j] != source && classBoxes[j] != target){
              (<HTMLElement>classBoxes[j]).style.top = (connection.top + connection.height + 20) + 'px';
              jsPlumbInstance.repaintEverything();
            }
          }
        }
        }

      },zIndex: 1000
    }), 
    100);


    //have to create local variables for jsplumb
    var dialog = this.dialog;
    var dialogRef = this.dialogRef;
    var connectionType;


    //auto connect before binding connections
    this.autoConnect();


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


      //on connection click
      jsPlumbInstance.bind("click",function(connection){
        if(id == connection['source']['id']){
          dialogRef = dialog.open(DialogTestComponent, {width: '250px'});
          dialogRef.componentInstance.buttonPressed = "connection";
          dialogRef.afterClosed().subscribe(() => {
            connectionType = dialogRef.componentInstance.connectionType;
            switch(connectionType){
              //open diamond, solid line
              //aggregation
              case 'purple':
                connection.removeAllOverlays();
                connection.setPaintStyle({stroke: 'purple', lineWidth: '10px'});
                connection.addOverlay(["Label",{label:"Aggregation",location:0.5}]);
                connection.addOverlay(["Diamond",{
                  cssClass: "unfilledDiamond",
                  width: 15,
                  length: 30,
                  location: 1
                }]);

                break;
              //association
              //just a line
              case 'green':
                connection.removeAllOverlays();
                connection.setPaintStyle({stroke: 'green', lineWidth: '10px'});
                connection.addOverlay(["Label",{label:"Association",location:0.5}]);
                break;
              //closed diamond, solid line
              //composition
              case 'red':
                connection.removeAllOverlays();
                connection.setPaintStyle({stroke: 'red', lineWidth: '10px'});
                connection.addOverlay(["Label",{label:"Composition",location:0.5}]);
                connection.addOverlay(["Diamond", {width: 15,length: 30,location: 1}]);
                break;
              //closed arrow, solid line
              //generalization
              case 'orange':
                connection.removeAllOverlays();
                connection.setPaintStyle({stroke: 'orange', lineWidth: '10px'});
                connection.addOverlay(["Label",{label:"Generalization",location:0.5}]);
                connection.addOverlay(["Arrow",{width: 15,lenght: 30,location:1}]);
                break;
              //closed arrow, dashed line
              //realization
              case 'yellow':
                connection.removeAllOverlays();
                connection.setPaintStyle({"dashstyle":'3 3',stroke:'yellow',strokeWidth:5});
                connection.addOverlay(["Label",{label:"Realization",location:0.5}]);
                connection.addOverlay(["Arrow",{width: 15,lenght: 30,location:1}]);
                break;
            }
          });
        }
      });

    
  }

  ngAfterViewChecked(){
    var editBox = document.querySelector('.editor');
    if(editBox != undefined){
      var classBox = document.querySelector('.'+this.name);
      var y = (<HTMLElement>classBox).style.top;
      var x = (<HTMLElement>classBox).style.left;

      //in case just created
      var position_x = document.querySelector('.'+this.name).getBoundingClientRect().left;
      var position_y = document.querySelector('.'+this.name).getBoundingClientRect().top;
      //variables
      if(this.edit == 'variables'){
        //no drag (just created)
        if(!y){

          (<HTMLElement>editBox).style.top = (position_y - 10) + 'px';
          
        }
        if(!x){
          (<HTMLElement>editBox).style.left = (position_x + 10) + 'px';
        }
        else if(y && x){
          //if dragged
          (<HTMLElement>editBox).style.top = (parseInt(y.split("p")[0]) + 50) + 'px';
          (<HTMLElement>editBox).style.left = (parseInt(x.split("p")[0]) + 10) + 'px';
        }
      }
      else if(this.edit == 'methods'){
        if(!y){
          (<HTMLElement>editBox).style.top = (position_y + 60) + 'px';
          
        }
        if(!x){
          (<HTMLElement>editBox).style.left = (position_x + 10) + 'px';
        }
        else if(y && x){
          //if dragged
          (<HTMLElement>editBox).style.top = (parseInt(y.split("p")[0]) + 130) + 'px';
          (<HTMLElement>editBox).style.left = (parseInt(x.split("p")[0]) + 10) + 'px';
        }
      }
      else if(this.edit == 'name'){

        if(!y){
          (<HTMLElement>editBox).style.top = (position_y - 60) + 'px';
          
        }
        if(!x){
          (<HTMLElement>editBox).style.left = (position_x + 10) + 'px';
        }
        else if(y && x){
          //if dragged
          (<HTMLElement>editBox).style.top = (parseInt(y.split("p")[0]) + 10) + 'px';
          (<HTMLElement>editBox).style.left = (parseInt(x.split("p")[0]) + 10) + 'px';
        }
      }
      (<HTMLElement>editBox).style.width = '230px';
    }
  }

  editChip(chip,newValue){
    var variable = this.variables.includes(chip);
    if(variable){
      this.variables[this.variables.indexOf(chip)] = newValue;
    }
    else{
      this.methods[this.methods.indexOf(chip)] = newValue;
    }
  }


  //remove chip
  removeMethod(method){
    var index = this.methods.indexOf(method);

    if(index >= 0){
      this.methods.splice(index,1);
    }

    //update sizes
    this.service.findClass(this.name)['methods'] = this.methods;
  }

  removeVariable(variable){
    var index = this.variables.indexOf(variable);

    if(index >= 0){
      this.variables.splice(index,1);
    }
    this.service.findClass(this.name)['variables'] = this.variables;
  }

  //auto generate composition connection on class creation
  autoConnect(){
    var established_connections: string[][] = [];
    var noVariables = (this.variables.length >= 1 && this.variables[0] != 'none') ? true : false;
    if(noVariables){
      for(var i = 0;i<this.variables.length;i++){
        var variableType = this.variables[i].split(" ")[0];
        var cls = this.service.findClass(variableType);
        if(cls != null){
          var target = document.querySelector('.'+cls['name']);
          var targetId = (<HTMLElement>target).id + '_top';
          var notAlreadyConnected = true;
          if(established_connections.length != 0){
            for(var j = 0;j< established_connections.length;j++){
              if(established_connections[j] == [this.id+"_bottom",targetId]){
                notAlreadyConnected = false;
                break;
              }
            }
          }
          else{
            notAlreadyConnected = true;
          }
          if(notAlreadyConnected){
            var connection = this.service.jsPlumbInstance.connect({uuids:[this.id+'_bottom',targetId]});
            //composition
            connection.removeAllOverlays();
            connection.setPaintStyle({stroke: 'red', lineWidth: '10px'});
            connection.addOverlay(["Label",{label:"Composition",location:0.5}]);
            connection.addOverlay(["Diamond", {width: 15,length: 30,location: 1}]);
            established_connections.push([this.id+'_bottom',targetId]);
          }
          else{
            continue;
          }
        }
      }
    }
  }

  //wrapper for opening editors
  openEditor(edit,input){
    this.edit = edit;
    switch(this.edit){
      case 'chip':
        this.editorVariables = input;
        if(this.variables.includes(input)){
          this.variables[this.variables.indexOf(input)] = input + '_-';
        }
        else{
          this.methods[this.methods.indexOf(input)] = input + '_-';
        }
        //se editor position
        setTimeout(function(){
          var editor = document.querySelector('.editor.chip');
          var chip = document.querySelector('.'+input+'_-').getBoundingClientRect();
          var chipX = chip['x'];
          var chipY = chip['y'];
          (<HTMLElement>editor).style.top = (chipY - 70) + 'px';
          (<HTMLElement>editor).style.left = (chipX - 20) + 'px';
        },1);

    }
  }

  pullVariables(){
    this.editorVariables = this.variables.join(",");
    this.edit = 'variables';
  }

  pullMethods(){
    this.editorMethods = this.methods.join(",");
    this.edit = 'methods';
  }

  pullName(){
    this.editorName = this.name;
    this.edit = 'name';
  }

  //editor change
  editVariables(){
    this.service.findClass(this.name)['variables'] = this.editorVariables.split(",");
    this.updateValues();
    this.edit = '';
  }

  editMethods(){
    this.service.findClass(this.name)['methods'] = this.editorMethods.split(",");
    this.updateValues();
    this.edit = '';
  }

  editName(){
    this.service.connectionsUpdateWrapper();
    //update connections with new name
    var connections = this.service.findClass(this.name)['connections'];
    for(var i = 0;i<connections.length;i++){
      var source = connections[i][0].split("_")[1];
      var newSource = this.editorName +'_'+ source;
      connections[i][0] = newSource;
    }
    this.id = this.id.replace(this.name,this.editorName);
    this.service.findClass(this.name)['name'] = this.editorName;
    var element = document.querySelector('.'+this.name);
    this.edit = '';
    this.name = this.editorName;
    this.service.findClass(this.name)['connections'] = connections;

    var id = this.id;
    //reset id of endpoints on name change
    this.service.jsPlumbInstance.selectEndpoints({source: element}).each(function(endpoint){
      endpoint['elementId'] = id;
    });

  }

  //this will change later
  deleteClass(){
    this.service.jsPlumbInstance.remove(this.id);
  }

  updateChip(){
    for(var i = 0;i<this.variables.length;i++){
      if(this.variables[i].includes('_-')){
        this.variables[i] = this.editorVariables;
      }
    }
    for(var i = 0;i<this.methods.length;i++){
      if(this.methods[i].includes('_-')){
        this.methods[i] = this.editorVariables;
      }
    }
    this.updateValues();
    this.edit = '';
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
    var cls = this.service.findClass(this.name);
    this.variables = cls['variables'];
    this.methods = cls['methods'];
  }

  existenceCheck(){
    if(this.editorName){
      var cls = document.querySelector('.'+this.editorName);
    }
    if(cls == null){
      this.exists = false;
    }
    else{
      this.exists = true;
    }
  }

}

  