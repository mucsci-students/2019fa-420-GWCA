import { Component, OnInit, Input, ViewChildren, ElementRef } from '@angular/core';

@Component({
  selector: 'app-dialog-test',
  templateUrl: './dialog-test.component.html',
  styleUrls: ['./dialog-test.component.css']
})
export class DialogTestComponent implements OnInit {
  @Input() buttonPressed: string;
  @Input() name: string;
  classNames;
  classes;
  choice;

  constructor() { }
  
  ngOnInit() {
    //gets class names to choose
    this.classNames = document.querySelectorAll("h2");
    
    //gets actual classes
    this.classes = document.querySelectorAll(".class-box");
    
  }

  search(className: string){
    for(var i = 0; i < this.classes.length;i++){
      if(this.classes[i].querySelector("h2").innerHTML === className){
        //get variable names
        console.log("Variables");
        var variables = this.classes[i].querySelectorAll(".variable");
        for(var j = 0; j < variables.length;j++){
          console.log(variables[j].innerHTML);
        }
        //get method names
        console.log("Methods");
        var methods = this.classes[i].querySelectorAll(".method");
        for(j = 0; j < methods.length;j++){
          console.log(methods[j].innerHTML);
        }
      }
    }
  }

}
