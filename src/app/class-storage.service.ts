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

  //searh array for class
  findClass(name){
    for(var i = 0;i<this.allClasses.length;i++){
      if(this.allClasses[i]['name'] == name){
        return this.allClasses[i];
      }
    }
    return null;
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
     /*this.jsPlumbInstance.addEndpoint(id,
       {
         anchor: [
           [ 0.5, 0, 0, -1, 0, 0, "top" ],
          //  [ 1, 0.5, 1, 0, 0, 0, "right" ],
          //  [ 0.5, 1, 0, 1, 0, 0, "bottom" ],
          //  [ 0, 0.5, -1, 0, 0, 0, "left" ],
    
         ],
         uuid:(id+"_top"),
         endpoint: ["Dot", { cssClass: "endpointClass", radius: 10, hoverClass: "endpointHoverClass" } ],
         hoverPaintStyle: {fill: "red"},
       },this.common
     );
    
     this.jsPlumbInstance.addEndpoint(id,
       {
         anchor: [
           [ 1, 0.5, 1, 0, 0, 0, "right" ],
           [ 0.5, 0, 0, -1, 0, 0, "top" ],
           [ 0.5, 1, 0, 1, 0, 0, "bottom" ],
           [ 0, 0.5, -1, 0, 0, 0, "left" ],
    
         ],
         uuid:(id+"_right"),
         endpoint: ["Dot", { cssClass: "endpointClass", radius: 10, hoverClass: "endpointHoverClass" } ],
         hoverPaintStyle: {fill: "red"},
       },this.common
     );

     this.jsPlumbInstance.addEndpoint(id,
       {
         anchor: [
           [ 0.5, 1, 0, 1, 0, 0, "bottom" ],
           [ 1, 0.5, 1, 0, 0, 0, "right" ],
           [ 0.5, 0, 0, -1, 0, 0, "top" ],
           [ 0, 0.5, -1, 0, 0, 0, "left" ],
    
         ],
         uuid:(id+"_bottom"),
         endpoint: ["Dot", { cssClass: "endpointClass", radius: 10, hoverClass: "endpointHoverClass" } ],
         hoverPaintStyle: {fill: "red"},
       },this.common
     );
    
    //left
    this.jsPlumbInstance.addEndpoint(id,
      {
        anchor: [
                  [ 0, 0.5, -1, 0, 0, 0, "left" ],
                  [ 0.5, 1, 0, 1, 0, 0, "bottom" ],
                  [ 1, 0.5, 1, 0, 0, 0, "right" ],
                  [ 0.5, 0, 0, -1, 0, 0, "top" ],
               ],
               uuid:(id+"_left"),
               endpoint: ["Dot", { cssClass: "endpointClass", radius: 10, hoverClass: "endpointHoverClass" } ],
               hoverPaintStyle: {fill: "red"},
      },this.common
    );*/

    //have only 2 continuous endpoints so that they can not overlap, but still move
    this.jsPlumbInstance.addEndpoint(id,{anchor: ["Continuous",{faces: ["top","right"]}],uuid:(id+"_top"),hoverPaintStyle: {fill: "red"}},this.common);
    this.jsPlumbInstance.addEndpoint(id,{anchor: ["Continuous",{faces: ["bottom","left"]}],uuid:(id+"_bottom"),hoverPaintStyle: {fill: "red"}},this.common);

    
  }

  //redraw all jsPlumb setttings & connections
  reinitializeConnections(){
    console.log("Reinitializing connections");
    this.jsPlumbInstance.reset();

    var class_boxes = document.querySelectorAll("app-class-box");
    //force break if no class boxes
    if(class_boxes.length == 0){
      return;
    }
        //re-initialize data
        for(var i = 0;i<class_boxes.length;i++){
          this.addEndpoints(class_boxes[i]['childNodes'][0]['id']);
          //  this.jsPlumbInstance.addEndpoint(class_boxes[i]['childNodes'][0]['id'],{anchor:"Top",uuid:(class_boxes[i]['firstChild']['attributes']['id'].value+"_top")},this.common);
          //  this.jsPlumbInstance.addEndpoint(class_boxes[i]['childNodes'][0]['id'],{anchor:"Bottom",uuid:(class_boxes[i]['firstChild']['attributes']['id'].value+"_bottom")},this.common);
          //  this.jsPlumbInstance.addEndpoint(class_boxes[i]['childNodes'][0]['id'],{anchor:"Right",uuid:(class_boxes[i]['firstChild']['attributes']['id'].value+"_right")},this.common);
          //  this.jsPlumbInstance.addEndpoint(class_boxes[i]['childNodes'][0]['id'],{anchor:"Left",uuid:(class_boxes[i]['firstChild']['attributes']['id'].value+"_left")},this.common);
          
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
