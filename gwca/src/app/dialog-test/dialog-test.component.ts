import { Component, OnInit, Input } from '@angular/core';


@Component({
  selector: 'app-dialog-test',
  templateUrl: './dialog-test.component.html',
  styleUrls: ['./dialog-test.component.css']
})
export class DialogTestComponent implements OnInit {

  @Input() name: string;
  constructor() { }

  ngOnInit() {
  }

}
