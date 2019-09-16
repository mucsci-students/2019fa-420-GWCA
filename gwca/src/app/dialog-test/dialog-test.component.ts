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

  constructor() { }
  
  ngOnInit() {
    this.classes = document.querySelectorAll(".class-box");
    // console.log(this.classNames);
    // this.listClasses();
    // this.classList = this.classes.nativeElement.querySelectorAll('class-box');
    // console.log((document.querySelectorAll('.class-box > .name')));
  }

  ngAfterViewInit(){
    // this.classList = this.classes.nativeElement.querySelectorAll('class-box');
  }        

  listClasses(){
    // console.log(this.classList);
  }

}
