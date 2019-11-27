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
  jsonString: string;








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
