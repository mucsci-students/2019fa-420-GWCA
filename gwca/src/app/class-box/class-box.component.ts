import { Component, OnInit, Output, EventEmitter, AfterViewInit, Self, OnDestroy } from '@angular/core';
import { ClassStorageService } from '../class-storage.service';
import { jsPlumb } from 'jsplumb';

@Component({
  selector: 'app-class-box',
  templateUrl: './class-box.component.html',
  styleUrls: ['./class-box.component.css']
})
export class ClassBoxComponent implements OnInit, AfterViewInit, OnDestroy {
  name: string;
  variables: string[];
  methods: string[];
  id: string;
  index: number = 0;



  constructor(private classService: ClassStorageService) { 
  }

  ngOnInit() {
    for(var i = this.classService.allClasses.length-1;i>0;i--){
      var test = document.getElementsByClassName(this.classService.allClasses[i]['name']);
      if(test.length == 0){
        this.index = i;
        break;
      }
    }
    this.name = this.classService.allClasses[this.index]['name'];
    this.id = this.name + "_" + this.classService.instance;
    this.variables = this.classService.allClasses[this.index]['variables'];
    this.methods = this.classService.allClasses[this.index]['methods'];
    this.classService.instance = this.classService.instance + 1;

  }


  ngAfterViewInit(){
    // console.log(this.name+" created");
    var jsPlumbInstance = this.classService.jsPlumbInstance;
    //var jsPlumbInstance = jsPlumb.getInstance();
     setTimeout(() =>
     jsPlumbInstance.draggable(this.id), 
     100);

     //get all the dynamically created elements
     var boxes = document.querySelectorAll("app-class-box");

     //keep track of the top shift value
     var topShift  = 20;
     for(var i = 0;i<boxes.length;i++){
      if(this.classService.leftShift > 900){
        this.classService.leftShift = 20;
        topShift = topShift + 300;
      }
        (<HTMLElement>boxes[i]).style.left = this.classService.leftShift + 'px';
        (<HTMLElement>boxes[i]).style.top = topShift + 'px';
        this.classService.leftShift = this.classService.leftShift + 300;
     }

    
    jsPlumbInstance.addEndpoint(this.id,{anchor: "Bottom",uuid:(this.name+"_bottom")},this.classService.common);
    jsPlumbInstance.addEndpoint(this.id,{anchor: "Right",uuid:(this.name+"_right")},this.classService.common);
    jsPlumbInstance.addEndpoint(this.id,{anchor: "Top",uuid:(this.name+"_top")},this.classService.common);
    jsPlumbInstance.addEndpoint(this.id,{anchor: "Left",uuid:(this.name+"_left")},this.classService.common);


    //no self connections
    jsPlumbInstance.bind("connection",function(){
      var connections = jsPlumbInstance.getConnections(this.id);
      for(var i = 0;i<connections.length;i++){
        if(connections[i]['source']['id'] == connections[i]['target']['id']){
          jsPlumbInstance.deleteConnection(connections[i]);
        }
      }
    });

   
  }

  ngOnDestroy(){
    // console.log(this.name+" destoyed");
  }



}
