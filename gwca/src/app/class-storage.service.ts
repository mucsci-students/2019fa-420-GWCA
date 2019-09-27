import { Injectable, Input, ViewChild, ViewContainerRef } from '@angular/core';
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
  jsPlumbInstance;


  constructor() {
    this.allClasses = [];
   }

  

  generate(){
    return this.allClasses[0];
  }


  findClass(name){
    for(var i = 0;i<this.allClasses.length;i++){
      if(this.allClasses[i]['name'] === name){
        return this.allClasses[i];
      }
    }
    return null;
  }

  createNew(classname: string, methods: string[],variables: string[]){
    //this.findClass(classname);
    this.allClasses.unshift({'name':classname,'methods':methods,'variables':variables});
  }

  pruneArray(){
    for(var i = 0;i < this.allClasses.length;i++){
      for(var j = (i+1);j< this.allClasses.length;j++){
        if(this.allClasses[i]['name'] === this.allClasses[j]['name']){
          this.allClasses.splice(j,1);
        }
      }
    }
  }

  addConnetor(){
     for(var i = 0;i<this.allClasses.length;i++){
        var el = document.getElementById(this.allClasses[i]['name']);
        console.log(el);
     }
  }

}
