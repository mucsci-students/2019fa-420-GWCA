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
    connector: "Flowchart",
    connectorOverlays: [
      ["Arrow", {width: 15,length: 30,location: 1,id: "arrow"}]
    ],
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

  revertLeftShift(){
    this.leftShift = 20;
    //console.log(this.leftShift);
  }

  reinitializeConnections(){
    this.jsPlumbInstance.reset();

    var class_boxes = document.querySelectorAll("app-class-box");

        //re-initialize data
        for(var i = 0;i<class_boxes.length;i++){
           this.jsPlumbInstance.addEndpoint(class_boxes[i]['childNodes'][0]['id'],{anchor:"Top",uuid:(class_boxes[i]['firstChild']['attributes']['id'].value+"_top")},this.common);
           this.jsPlumbInstance.addEndpoint(class_boxes[i]['childNodes'][0]['id'],{anchor:"Bottom",uuid:(class_boxes[i]['firstChild']['attributes']['id'].value+"_bottom")},this.common);
           this.jsPlumbInstance.addEndpoint(class_boxes[i]['childNodes'][0]['id'],{anchor:"Right",uuid:(class_boxes[i]['firstChild']['attributes']['id'].value+"_right")},this.common);
           this.jsPlumbInstance.addEndpoint(class_boxes[i]['childNodes'][0]['id'],{anchor:"Left",uuid:(class_boxes[i]['firstChild']['attributes']['id'].value+"_left")},this.common);
          
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
         var source = classes[i]['connections'][j][0].split("_")[0];
         var sourcePosition = classes[i]['connections'][j][0].split("_")[1];
         var srcElement = document.querySelector("app-class-box ."+source).id;
         var target = classes[i]['connections'][j][1].split("_")[0]
         var targetPosition = classes[i]['connections'][j][1].split("_")[1];
         var targetElement = document.querySelector("app-class-box ."+target).id;

         var connectionType = classes[i]['connections'][j][2];
         this.jsPlumbInstance.connect({
           uuids:[(srcElement+"_"+sourcePosition),(targetElement+"_"+targetPosition)],
           paintStyle: {stroke: connectionType, lineWidth: '10px'},
         });
        }

     }
    }
  }

  //push a new class into the array (front) and update our corresponding JSON model
  createNew(classname: string, methods: string[],variables: string[]){
    this.allClasses.unshift({'name':classname,'methods':methods,'variables':variables,'connections':[]});
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

    //deletes class in array
    deleteClass (classname: String) {
	var successVal = false;
	for (var i = 0; i < this.allClasses.length; i++) {
	    if (this.allClasses[i]['name'] === classname) {
		this.allClasses.splice(i,1);
		successVal = true;
	    }
	}
	return successVal;
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
