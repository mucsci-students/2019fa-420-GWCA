import { Component, ViewChild, ViewContainerRef } from '@angular/core';
import { ClassStorageService } from './class-storage.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})

export class AppComponent {
  title = 'gwca';

  @ViewChild('container',{static: false}) rf: ViewContainerRef;

  constructor(public service: ClassStorageService){

  }
}
