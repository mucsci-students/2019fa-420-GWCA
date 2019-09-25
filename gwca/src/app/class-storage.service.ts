import { Injectable, Input, ViewChild, ViewContainerRef } from '@angular/core';



export interface fullClass {
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

  //this function outputs the current diagram as a JSON string
  diagramToJSON(){
    var diagram = JSON.stringify(this.allClasses);      
    console.log("diagram = " + diagram);
  }

  //This function takes in a JSON string, and creates it's corresponding diagram.
  jsonToClasses(data){
    try{
      var diagram = JSON.parse(data);
      console.log(diagram);
      //this.allClasses.length = 0;
      diagram.forEach(element => {
        this.createNew(element.name, element.methods, element.variables);
        console.log(element.name + " " + element.methods + " " + element.variables);
      });
    }
    catch(e) {
      console.log(e);
    }
  }

  jsonToClassesTesting(){
    var data = [
                  {"name":"Class2","methods":["method2()","method3()"],"variables":["var2","var3","var4"]},
                  {"name":"Class1","methods":["method1()"],"variables":["var1"]}
                ]
    this.jsonToClasses(JSON.stringify(data));
    }
}
