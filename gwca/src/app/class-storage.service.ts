import { Injectable } from '@angular/core';
import { jsPlumb } from 'jsplumb';


export interface fullClass {
  name: string;
  methods: string[];
  variables: string[];
  
}

@Injectable({
  providedIn: 'root'
})

export class ClassStorageService {
  allClasses: fullClass[];
  generateComponent: boolean;
  jsonString: string;
  jsPlumbInstance;
  //jsPlumb endpoint settings
  target = {
    anchor: "Top",
    endpoint: "Rectangle",
    isTarget: true
  };
  source = {
    isSource: true
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
      if(this.allClasses[i]['name'] === name){
        return this.allClasses[i];
      }
    }
    return null;
  }

  //push a new class into the array (front)
  createNew(classname: string, methods: string[],variables: string[]){
    //this.findClass(classname);
    this.allClasses.unshift({'name':classname,'methods':methods,'variables':variables});
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


  //this function outputs the current diagram as a JSON string
  diagramToJSON(){
    var diagram = JSON.stringify(this.allClasses);      
    this.jsonString = diagram;
  }

  //This function takes in a JSON string, and creates it's corresponding diagram.
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
    
   //adds the connectors from jsplumb to the classes  
  addConnetor(){
     for(var i = 0;i<this.allClasses.length;i++){
        var el = document.getElementById(this.allClasses[i]['name']);
     }
  }

}
