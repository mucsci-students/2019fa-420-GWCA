import { Injectable, Input, ViewChild, ViewContainerRef } from '@angular/core';
import { VariableAst } from '@angular/compiler';



interface fullClass {
  name: string;
  methods: string[];
  variables: string[];
}

@Injectable({
  providedIn: 'root'
})

export class ClassStorageService {
  className: string;
  classes: Array<{className: string}>;
  allClasses: fullClass[];
  generateComponent: boolean;


  
  constructor() {
    this.className = '';
    this.classes = [];
    this.allClasses = [];
   }

  

  generate(){
    return this.allClasses[0];
  }

  addClass(name){
    this.classes.push(name);
  }

  findClass(name){
    for(var i = 0;i<this.allClasses.length;i++){
      if(this.allClasses[i]['name'] === name){
        return this.allClasses[i];
      }
    }
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
    console.log(this.allClasses);
  }

  printClasses(){
    console.log(this.classes.pop());
  }
}
