import { Injectable } from '@angular/core';

/*
* This file is where the actual service is defined. This is what is referred to 
* when I discussing adding/removing features to the back end of our project.
* It's extremely important to understand that the majority of the data manipulation
* in this project involves this file, dialog-test.component.ts, and 
* dialog-test.component.html
*
* If you can't figure out the workflow between these three files, ask somebody.
*/

export interface fullClass {
  name: string;
  methods: string[];
  variables: string[];
  //array with arrays inside where the first value is the source and the second is the target
  connections: string[][];
  //position x,y
  position: string[];
}

@Injectable({
  providedIn: 'root'
})

export class ClassStorageService {
  allClasses: fullClass[];
  generateComponent: boolean;
  jsonString: string;
  jsPlumbInstance;
  leftShift: number = 20;
  instance: number = 0;


  //jsPlumb endpoint settings
  common = {
    isTarget: true,
    isSource: true,
    paintStyle: {fill: "green"},
    maxConnections: -1,
    connector: ["Flowchart", {stub: [40, 60], gap: 10,alwaysRespectStubs: true},{anchors: ["Bottom","Top","Left","Right"]}],
    connectorOverlays: [
      ["Arrow", {width: 15,length: 30,location: 1,id: "arrow"}]
    ],
    endpoint: "Dot",
    DoNotThrowErrors: true,
  
  };




  //initialize the list that holds the classes
  
  constructor() {
    this.allClasses = [];
   }

  //gets 1st element of list for the view
  generate(){
    return this.allClasses[0];
  }

  //searh array for class by name, return it
  findClass(name){
    for(var i = 0;i<this.allClasses.length;i++){
      if(this.allClasses[i]['name'] == name){
        return this.allClasses[i];
      }
    }
    return null;
  }

  //searh array for class by name, return its index
  findClassIndex(name){
    for(var i = 0;i<this.allClasses.length;i++){
      if(this.allClasses[i]['name'] == name){
        return i;
      }
    }
    return null;
  }

  //this function takes in an index, and removes the class at that index
  removeClassByIndex(index: number){
    if (index !== -1){
      this.allClasses.splice(index, 1);
      return true;
    }
    return "index not valid";
  }

  //getters

  getName(cls:fullClass){
    return cls['name'];
  }

  getMethods(cls:fullClass){
    return cls['methods'];
  }

  getVariables(cls:fullClass){
    return cls['variables'];
  }

  getConnections(cls:fullClass){
    return cls['connections'];
  }

  getPosition(cls:fullClass){
    return cls['position'];
  }

  setPosition(cls:fullClass,x:string,y:string){
    cls['position'] = [x,y];
  }

  revertLeftShift(){
    this.leftShift = 20;
    //console.log(this.leftShift);
  }

  addEndpoints(id:string){

    //have only 2 continuous endpoints so that they can not overlap, but still move
    this.jsPlumbInstance.addEndpoint(id,{anchor: ["Continuous",{faces: ["top","right","bottom","left"]}],uuid:(id+"_top"),hoverPaintStyle: {fill: "red"}},this.common);
    this.jsPlumbInstance.addEndpoint(id,{anchor: ["Continuous",{faces: ["bottom","left","top","right"]}],uuid:(id+"_bottom"),hoverPaintStyle: {fill: "red"}},this.common);
    this.jsPlumbInstance.addEndpoint(id,{anchor: ["Continuous",{faces: ["left","right","bottom","top"]}],uuid:(id+"_left"),hoverPaintStyle: {fill: "red"}},this.common);
    this.jsPlumbInstance.addEndpoint(id,{anchor: ["Continuous",{faces: ["right","left","top","botttom"]}],uuid:(id+"_right"),hoverPaintStyle: {fill: "red"}},this.common);

    //allow to just drag connection to div to be able to make connections
    this.jsPlumbInstance.makeTarget(id,{anchor: ["Continuous",{faces: ["top","bottom","left","right"]}]},this.common);

    //fixes error where endpoints don't properly align with box
    this.jsPlumbInstance.repaintEverything();
    
  }

  //redraw all jsPlumb setttings & connections
  reinitializeConnections(){
    this.jsPlumbInstance.reset();

    var class_boxes = document.querySelectorAll("app-class-box");
    //force break if no class boxes
    if(class_boxes.length == 0){
      return;
    }
        //re-initialize data
        for(var i = 0;i<class_boxes.length;i++){
          this.addEndpoints(class_boxes[i]['childNodes'][0]['id']);
          
          
          // //re-bind the "no link to self rule"
          var jsPlumbInstance = this.jsPlumbInstance;
          this.jsPlumbInstance.bind("connection",function(endpoint){
              if(endpoint['source']['attributes'][4].value == endpoint['target']['attributes'][4].value){
                var connection = jsPlumbInstance.getConnections({source: endpoint['source']['attributes'][4].value,target: endpoint['target']['attributes'][4].value });
                jsPlumbInstance.deleteConnection(connection[0]);
              }
           });

        }


    var classes = this.allClasses;
    for(var i = 0;i<classes.length;i++){
      if(classes[i]['connections'].length !== 0){
        for(var j = 0;j<classes[i]['connections'].length;j++){
          //have to format the uuid a little to get the update element
          //skip element if doesn't exist
          if((document.getElementsByClassName((classes[i]['connections'][j][1]).split("_")[0])).length == 0){
            continue;
          }
         var source = classes[i]['connections'][j][0].split("_")[0];
         var sourcePosition = classes[i]['connections'][j][0].split("_")[1];
         var srcElement = document.querySelector("app-class-box ."+source).id;
         var target = classes[i]['connections'][j][1].split("_")[0]
         var targetPosition = classes[i]['connections'][j][1].split("_")[1];
         var targetElement = document.querySelector("app-class-box ."+target).id;

        //  console.log(srcElement+"_"+sourcePosition);
        //  console.log(targetElement+"_"+targetPosition);
         var connectionType = classes[i]['connections'][j][2];
         //skip
         
         var connection = this.jsPlumbInstance.connect({
           uuids:[(srcElement+"_"+sourcePosition),(targetElement+"_"+targetPosition)],
           
         });
         switch(connectionType){
            //open diamond, solid line
            //aggregation
            case 'Aggregation':
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
            //just a line
            //association
            case 'Association':
              connection.removeAllOverlays();
              connection.setPaintStyle({stroke: 'green', lineWidth: '10px'});
              connection.addOverlay(["Label",{label:"Association",location:0.5}]);
              break;
            //closed diamond, solid line
            //composition
            case 'Composition':
              connection.removeAllOverlays();
              connection.setPaintStyle({stroke: 'red', lineWidth: '10px'});
              connection.addOverlay(["Label",{label:"Composition",location:0.5}]);
              connection.addOverlay(["Diamond", {width: 15,length: 30,location: 1}]);
              break;
            //closed arrow, solid line
            //generalization
            case 'Generalization':
              connection.setPaintStyle({stroke: 'orange', lineWidth: '10px'});
              connection.addOverlay(["Label",{label:"Generalization",location:0.5}]);
              break;
            //closed arrow, dashed line
            //realization
            case 'Realization':
              connection.setPaintStyle({"dashstyle":'3 3',stroke:'yellow',strokeWidth:5});
              connection.addOverlay(["Label",{label:"Realization",location:0.5}]);
              break;
          }
        }
      }

    }
  }


 

  //push a new class into the array (front) and update our corresponding JSON model
  createNew(classname: string, methods: string[],variables: string[]){
    this.allClasses.unshift({'name':classname,'methods':methods,'variables':variables,'connections':[],'position':[]});
    this.pruneArray();
  }

  //remove duplicates in the array
  pruneArray(){
    for(var i = 0;i < this.allClasses.length;i++){
      for(var j = (i+1);j< this.allClasses.length;j++){
        if(this.allClasses[i]['name'] === this.allClasses[j]['name']){
          this.allClasses.splice(j,1);
        }
      }
    }
  }

  //update connections
  //find the class in the back-end array and add the connection
  insertConnection(source:string, target: string,style: string){
    var sourceClass = source.split("_")[0];


    var sourcePosition = [source.split("_")[0],source.split("_")[2]].join("_");
    var targetPosition = [target.split("_")[0],target.split("_")[2]].join("_");


     var connections = this.findClass(sourceClass)['connections'];
     if(connections.length == 1){
       if(connections[0] !== [source,target]){
         this.findClass(sourceClass)['connections'].push([sourcePosition,targetPosition,style]);
       }
     }
     else if(connections.length == 0){
       this.findClass(sourceClass)['connections'].push([sourcePosition,targetPosition,style]);
     }
     else{
       for(var i = 0; i< connections.length;i++){
         if(connections[i] == [sourcePosition,target]){
           return;
         }
       }
       this.findClass(sourceClass)['connections'].push([sourcePosition,targetPosition,style]);
     }
  }
 

  updateConnections() : string[][] {
    //find all classes in the DOM and then iterate through all of them and add connections to the back-end
    var elements = document.querySelectorAll('.class-box');
    var jsPlumbInstance = this.jsPlumbInstance;
    var all_connections: string[][] = [];
    for(var i = 0;i< elements.length;i++){
      //var connections = this.service.jsPlumbInstance.getConnections({source: elements[i].id});
      jsPlumbInstance.selectEndpoints({source:elements[i].id}).each(function(endpoint){

        if(endpoint['connections'].length != 0){
          //find element in DOM
          for(var j = 0;j<endpoint['connections'].length;j++){
            if(endpoint['connections'][j]['endpoints'][0] == endpoint){
              var target = endpoint['connections'][j]['endpoints'][1].getUuid();
              var source = endpoint.getUuid();
              //if source or target undefined
              if(!source){
                source = endpoint['connections'][j]['endpoints'][0]['elementId'] + "_" + endpoint['connections'][j]['endpoints'][0]['_continuousAnchorEdge'];
              }
              if(!target){
                target = endpoint['connections'][j]['endpoints'][1]['elementId'] + "_" + endpoint['connections'][j]['endpoints'][1]['_continuousAnchorEdge'];
              }
              var connectionStyle = endpoint['connections'][0].getPaintStyle()['stroke'];
              switch(connectionStyle){
                case 'purple':
                  var connectionType = 'Aggregation';
                  break;
                case 'green':
                    var connectionType = 'Association';
                    break;
                case 'red':
                  var connectionType = 'Composition';
                  break;
                case 'orange':
                  var connectionType = 'Generalization';
                  break;
                case 'yellow':
                  var connectionType = 'Realization';
                  break;
              }

              all_connections.push([source,target,connectionType]);
            }
          }
        }
      });
    }
    return all_connections;
  }

  //wrapper for updating the connections
  connectionsUpdateWrapper(){
    var connections = this.updateConnections();
    for(var i = 0;i<connections.length;i++){
      this.insertConnection(connections[i][0],connections[i][1],connections[i][2]);
    }
  }



 // this function outputs the current diagram as a JSON string
  diagramToJSON(){
    var diagram = JSON.stringify(this.allClasses);      
    this.jsonString = diagram;
  }

  /*
  * This function takes in a JSON string, and creates it's corresponding diagram.
  * note how we iterate over the JSON and call create new on each object.
  */
  jsonToClasses(data){
    try{
      var importedDiagram = JSON.parse(data);
      this.allClasses.length = 0;
      for(var i = 0; i < importedDiagram.length; i++){
        this.createNew(importedDiagram[i].name, importedDiagram[i].methods, importedDiagram[i].variables);
      }
    }
    catch(e) {
      console.log(e);
    }
  }
}
