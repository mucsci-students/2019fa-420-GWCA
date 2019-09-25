import { Component, OnInit, Input, ComponentRef, ViewChild, ViewContainerRef } from '@angular/core';
import { ClassStorageService } from '../class-storage.service';

@Component({
  selector: 'app-dialog-test',
  templateUrl: './dialog-test.component.html',
  styleUrls: ['./dialog-test.component.css']
})

export class DialogTestComponent implements OnInit {
  @Input() buttonPressed: string;
  @Input() name: string;
  classNames: NodeListOf<Element>;
  classes: NodeListOf<Element>;
  choice: string;
  //input values for create new
  className: string;
  variables: string;
  methods: string;

  constructor(public service: ClassStorageService) { }

  ngOnInit() {
    this.choice = "";
    //gets class names to choose
    this.classNames = document.querySelectorAll("h2");
    
    //gets actual classes
    this.classes = document.querySelectorAll(".class-box");
    
  }

  search(Name: string){
    this.className = this.service.findClass(Name)['name'];
    this.variables = this.service.findClass(Name)['variables'].join(',');
    this.methods = this.service.findClass(Name)['methods'].join(',');
    this.choice = 'found';

  }



  updateClass(){

    //update the back-end
    this.service.createNew(this.className,this.methods.split(','),this.variables.split(','));
    //this.service.allClasses.shift();
    var cls = document.querySelector('.'+CSS.escape(this.className));
    
    //update
    cls.remove();
  }

  insertData(){
    //remove spaces and replace with underscores
    this.className = this.className.replace(/\s/g,"_");
    this.service.createNew(this.className,this.methods.split(","),this.variables.split(","));

  
  }

  // tester(){
  //   console.log(document.getElementsByClassName("classes")[0].children);
  // }


}
