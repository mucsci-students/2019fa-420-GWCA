import { Injectable } from '@angular/core';
import * as yaml from "js-yaml";

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

  //search a class's varaibles array, return index of target
  findVarIndex(target: fullClass, variable: string){
    for(var i = 0; i<target.variables.length;i++){
      var currVar = target.variables[i].split(" ");
      if(currVar[1] == variable){
        return i;
      }
    }
    return -1;
  }

  //search a class's methods array, return index of target
  findMethIndex(target: fullClass, method: string){
    for(var i = 0; i<target.methods.length;i++){
      if(target.methods[i] == method){
        return i;
      }
    }
    return -1;
  }

  removeAttribute(target: fullClass, attribute: string, index:number){
    if(index !== -1){
      if(attribute == "methods"){
        target.methods.splice(index, 1);
        return true
      }
      else if(attribute == "variables"){
        target.variables.splice(index, 1);
        return true
      }
      else{
        return false;
      }
    }
    else{
      return false;
    }
  }

  removeAllAttribute(target: fullClass, attribute: string){
    if(attribute == "methods"){
      for(var i = 0; i <= target.methods.length + 1; i++){
        target.methods.pop();
      }
    }
    else if(attribute == "variables"){
      for(var i = 0; i <= target.variables.length + 1; i++){
        target.variables.pop();
      }
    }
    else{
      return false;
    }
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



  import(event: any){
    let reader = new FileReader();
    let file: File = event.target.files[0];
    reader.readAsText(file);

    reader.onloadend = (e) => {
      let data = yaml.safeLoad(reader.result);
      this.allClasses = data;
    }
    
  }

  export(){
    var exportedYAML = yaml.safeDump(this.allClasses);
    var element = document.createElement('a');
    element.className = 'hidden-link'
    element.href = "data:text/yml;charset=UTF-8," + encodeURIComponent(exportedYAML);
    element.download = "data.yml";
    element.click(); // simulate click 
  }

  
}
