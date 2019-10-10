import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { NgTerminal, NgTerminalModule } from 'ng-terminal';


@Component({
  selector: 'app-cli',
  templateUrl: './cli.component.html',
  styleUrls: ['./cli.component.css']
})
export class CliComponent implements OnInit, AfterViewInit {
  @ViewChild('term', { static: true }) child: NgTerminal;
  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit(){
      this.child.keyEventInput.subscribe(e => {
        console.log('keyboard event:' + e.domEvent.keyCode + ', ' + e.key);

        const ev = e.domEvent;
        const printable = !ev.altKey && !ev.ctrlKey && !ev.metaKey;

        if (ev.keyCode === 13) {
          this.child.write('\r\n$ ');
        } else if (ev.keyCode === 8) {
          // Do not delete the prompt
          if (this.child.underlying.buffer.cursorX > 2) {
            this.child.write('\b \b');
          }
        } else if (printable) {
          this.child.write(e.key);
        }
      })
    }
}
