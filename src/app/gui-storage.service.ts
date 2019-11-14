import { Injectable } from '@angular/core';
import { ClassStorageService } from './class-storage.service';

@Injectable({
  providedIn: 'root'
})

//strictly GUI service, this will be tested less, and will allow for more
//separation between controller/view functionality and the model
export class GuiStorageService {
  //class box instance (need for JsPlumb IDs)
  instance: number = 0;
  //instance of jsPlumb
  jsPlumbInstance;
  //offset for GUI class boxes
  leftShift: number = 20;

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

  constructor(public storageService: ClassStorageService) { 

  }

  revertLeftShift(){
    this.leftShift = 20;
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

  //binding functionality to JsPlumb connections
  bindConnections(dialogRef,dialog,jsPlumbInstance,connectionType,DialogTestComponent,id){
    jsPlumbInstance.bind("connection",function(){
      var connections = jsPlumbInstance.getConnections(this.id);
      //no multiple connections between the same class boxes
      var previous_connections = jsPlumbInstance.getConnections({source:this.id,target:connections[(connections.length - 1)]['target']['id']});
      if(previous_connections.length > 1){
        jsPlumbInstance.deleteConnection(connections[(connections.length - 1)]);
      }
      else{
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
        }

    });

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


    var classes = this.storageService.allClasses;
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


  //update connections
  //find the class in the back-end array and add the connection
  insertConnection(source:string, target: string,style: string){
    var sourceClass = source.split("_")[0];


    var sourcePosition = [source.split("_")[0],source.split("_")[2]].join("_");
    var targetPosition = [target.split("_")[0],target.split("_")[2]].join("_");


     var connections = this.storageService.findClass(sourceClass)['connections'];
     if(connections.length == 1){
       if(connections[0] !== [source,target]){
         this.storageService.findClass(sourceClass)['connections'].push([sourcePosition,targetPosition,style]);
       }
     }
     else if(connections.length == 0){
       this.storageService.findClass(sourceClass)['connections'].push([sourcePosition,targetPosition,style]);
     }
     else{
       for(var i = 0; i< connections.length;i++){
         if(connections[i] == [sourcePosition,target]){
           return;
         }
       }
       this.storageService.findClass(sourceClass)['connections'].push([sourcePosition,targetPosition,style]);
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



}
