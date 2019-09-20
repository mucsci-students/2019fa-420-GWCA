import { Component } from '@angular/core';
import { ClassStorageService } from './class-storage.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})

export class AppComponent {
  title = 'gwca';

  public name: String;

  constructor(private _service: ClassStorageService){

  }

  write(){
    //console.log(this.name);
    this._service.addClass(this.name);
  }

  read(){
    console.log(this._service.printClasses());
  }


}
