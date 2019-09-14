import { Component, OnInit, ViewContainerRef,ViewChild,ComponentFactoryResolver } from '@angular/core';
import { ClassBoxComponent } from '../class-box/class-box.component';

@Component({
  selector: 'app-class-area',
  templateUrl: './class-area.component.html',
  styleUrls: ['./class-area.component.css']
})
export class ClassAreaComponent implements OnInit {
  @ViewChild('container',{static:true,read: ViewContainerRef}) ref
  
  constructor(private resolver: ComponentFactoryResolver) { }

  ngOnInit() {
  }

  createClass(){
    const factory = this.resolver.resolveComponentFactory(ClassBoxComponent);
    const temp = this.ref.createComponent(factory);
  }

}
