import { Component, OnInit, Output, EventEmitter, AfterViewInit, Self } from '@angular/core';
import { ClassStorageService } from '../class-storage.service';
import { jsPlumb } from 'jsplumb';

@Component({
  selector: 'app-class-box',
  templateUrl: './class-box.component.html',
  styleUrls: ['./class-box.component.css']
})
export class ClassBoxComponent implements OnInit, AfterViewInit {
  name: string;
  variables: string[];
  methods: string[];
  //jsplumb settings for connectors
  source = {
    endpoint: "Rectangle",
    isSource: true,
    isTarget: false,
    maxConnections: 1,
    cssClass: "sourceBottom",
  };

  target = {
    endpoint: "Dot",
    isSource: false,
    isTarget: true,
    maxConnections: 1,
    cssClass: "targetTop",
  };


  constructor(private classService: ClassStorageService) { 
  }

  ngOnInit() {
    this.name = this.classService.allClasses[0]['name'];
    this.variables = this.classService.allClasses[0]['variables'];
    this.methods = this.classService.allClasses[0]['methods'];

  }

  //left: 244
  //top: 117
  //have to wait otherwise can't find element in DOM and won't make draggable
  ngAfterViewInit(){
    var jsPlumbInstance = this.classService.jsPlumbInstance;
    //var jsPlumbInstance = jsPlumb.getInstance();
     setTimeout(() =>
     jsPlumbInstance.draggable(this.name), 
     100);

     //get all the dynamically created elements
     var boxes = document.querySelectorAll("app-class-box");
     //keep track of the left shift value
     var leftShift = 20;
     //keep track of the top shift value
     var topShift  = 20;
     for(var i = 0;i<boxes.length;i++){
      if(leftShift > 900){
        leftShift = 20;
        topShift = topShift + 300;
      }
        (<HTMLElement>boxes[i]).style.left = leftShift + 'px';
        (<HTMLElement>boxes[i]).style.top = topShift + 'px';
      leftShift = leftShift + 300;
     }

    //add source connectors (connect to others)
    jsPlumbInstance.addEndpoint(this.name,this.classService.source_1,this.classService.source_common);
    jsPlumbInstance.addEndpoint(this.name,this.classService.source_2,this.classService.source_common);
    //add target connectors (get connected to)
    jsPlumbInstance.addEndpoint(this.name,this.classService.target_1,this.classService.target_common);
    jsPlumbInstance.addEndpoint(this.name,this.classService.target_2,this.classService.target_common);

    // var boxes = document.querySelectorAll("app-class-box");
    // for(var i = 0;i<boxes.length;i++){
    //   (<HTMLElement>boxes[i]).style.marginLeft = (20 + (300 * (this.classService.currentContainerIndex -1))) + 'px';
    // }

   
  }



}
