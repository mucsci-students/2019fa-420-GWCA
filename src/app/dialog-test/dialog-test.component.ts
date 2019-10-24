import { Component, OnInit, Input, ComponentRef, ViewChild, ViewContainerRef } from '@angular/core';
import { ClassStorageService } from '../class-storage.service';
import { Subscription, Observable, Subject } from 'rxjs';

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
  //export
  //import value
  diagram: string;
  //exportString: 
  connectionType: string;
  //boolean to check to see if class already exists
  exists: boolean;

  constructor(public service: ClassStorageService) { 
    this.exists = true;
  }

  ngOnInit() {
    this.choice = "";
  
    //gets class names to choose
    this.classNames = document.querySelectorAll("h2");
    }


  search(Name: string){
    this.className = this.service.findClass(Name)['name'];
    this.variables = this.service.findClass(Name)['variables'].join(',');
    this.methods = this.service.findClass(Name)['methods'].join(',');
    this.choice = 'found';

  }

  //make sure class doesn't already exist
  existenceCheck(){
    var elementCheck = document.getElementsByClassName(this.className);
    if(elementCheck.length == 0 && this.className != undefined){
      this.exists = false;
    }
    else{
      this.exists = true;
    }
  }

  



  updateClass(){

    //update the back-end
    this.service.createNew(this.className,this.methods.split(','),this.variables.split(','));
    //var cls = document.querySelector('.'+CSS.escape(this.className));

    //wrapper for re-inializing connections & endpoints
    this.service.reinitializeConnections();
    
    
  }

  replaceUndefined(){
    if(this.methods === undefined){
      this.methods = 'none';
    }
    if(this.variables === undefined){
      this.variables = 'none';
    }
  }

  insertData(){
    //remove spaces and replace with underscores
    this.className = this.className.replace(/\s/g,"_");
    //check to see if input data
    this.replaceUndefined();
    this.service.createNew(this.className,this.methods.split(","),this.variables.split(","));
    this.exists = true;
  }

  //wrapper for the add button functionality
  addButton(){
    this.insertData();
  }
  //wrapper for the edit button functionality
  editButton(){
    this.updateClass();
  }
  //wrapper for import button functionality
  importButton(){
    this.importDiagram(this.diagram);
  }
  //wrapper for export button functionality
  exportButton(){

  }


  /*
  * importDiagram is basically just a wrapper for the service's import method.
  * This needs to be done because we can't directly call the service in the (click)
  * listener on line 65 of dialogue-test.component.html.
  */
  importDiagram(diagram){
    this.service.jsonToClasses(diagram);
  }

  updateStoredDiagram(){
    this.service.diagramToJSON();
  }  
}
