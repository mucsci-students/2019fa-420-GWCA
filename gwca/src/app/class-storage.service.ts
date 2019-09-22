import { Injectable, Input, ViewChild, ViewContainerRef } from '@angular/core';



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
    this.generateComponent = false;
   }

  createNew(classname: string, methods: string[],variables: string[]){
      this.allClasses.unshift({'name':classname,'methods':methods,'variables':variables});
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
        console.log(this.allClasses[i]);
        return this.allClasses[i];
      }
    }
  }

  printClasses(){
    console.log(this.classes.pop());
  }
}
