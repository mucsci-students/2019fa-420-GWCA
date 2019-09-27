import { Component, OnInit, Output, EventEmitter, AfterViewInit } from '@angular/core';
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

  source = {
    endpoint: "Rectangle",
    isSource: true,
    isTarget: false,
    maxConnections: 1,
  };

  target = {
    endpoint: "Dot",
    isSource: false,
    isTarget: true,
    maxConnections: 1,

  }


  constructor(private classService: ClassStorageService) { 
  }

  ngOnInit() {
    this.name = this.classService.allClasses[0]['name'];
    this.variables = this.classService.allClasses[0]['variables'];
    this.methods = this.classService.allClasses[0]['methods'];
    //  var element = document.querySelectorAll('.class-box');
    //  for(var i=0;i<element.length;i++){
    //    element[i]['style']['transform'] = 'translateX('+(i*300)+'px)';
    //  }
    
    // instance.makeSource(this.name,{
    //   anchor: 'Continuous',
    //   endpoint: ['Rectangle'],
    // });
  }

  //have to wait otherwise can't find element in DOM and won't make draggable
  ngAfterViewInit(){
    setTimeout(() => this.classService.jsPlumbInstance.draggable(document.getElementById(this.name)),2000);
  }



}
