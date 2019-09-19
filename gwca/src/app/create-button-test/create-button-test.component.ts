import { Component, OnInit, NgModule} from '@angular/core';
import { StorageService } from '../storage.service';




@Component({
  selector: 'app-create-button-test',
  templateUrl: './create-button-test.component.html',
  styleUrls: ['./create-button-test.component.css']
})
export class CreateButtonTestComponent implements OnInit {

  constructor(public storage: StorageService){}

  ngOnInit() {
    this.storage.test();
  }





}
