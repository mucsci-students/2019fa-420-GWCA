import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-class-box',
  templateUrl: './class-box.component.html',
  styleUrls: ['./class-box.component.css']
})
export class ClassBoxComponent implements OnInit {
  name: string = "Test"
  variables: string[] = ["variable1","variable2","variable3"];
  methods: string[] = ["method1","method2","method3"];
  constructor() { }

  ngOnInit() {
  }

}
