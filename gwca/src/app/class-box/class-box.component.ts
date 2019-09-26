import { Component, OnInit } from '@angular/core';
import { ClassStorageService } from '../class-storage.service';
import { all } from 'q';

@Component({
  selector: 'app-class-box',
  templateUrl: './class-box.component.html',
  styleUrls: ['./class-box.component.css']
})
export class ClassBoxComponent implements OnInit {
  name: string;
  variables: string[];
  methods: string[];
  constructor(private classService: ClassStorageService) { }

  ngOnInit() {
    this.name = this.classService.allClasses[0]['name'];
    this.variables = this.classService.allClasses[0]['variables'];
    this.methods = this.classService.allClasses[0]['methods'];
    this.classService.allClasses.unshift(this.classService.allClasses.pop());
  }

}
