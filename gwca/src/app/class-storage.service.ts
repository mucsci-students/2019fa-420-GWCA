import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class ClassStorageService {
  className: string;
  classes: Array<{className: string}>;

  constructor() {
    this.className = '';
    this.classes = [];
   }

  addClass(name){
    this.classes.push(name);
  }

  printClasses(){
    console.log(this.classes.pop());
  }
}
