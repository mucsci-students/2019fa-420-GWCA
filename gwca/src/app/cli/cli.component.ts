import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { NgTerminal, NgTerminalModule } from 'ng-terminal';
import { IBufferLine } from 'xterm';
import { Router } from '@angular/router';


@Component({
  selector: 'app-cli',
  templateUrl: './cli.component.html',
  styleUrls: ['./cli.component.css']
})
export class CliComponent implements OnInit, AfterViewInit {
  @ViewChild('term', { static: true }) child: NgTerminal;

  constructor( public router : Router ) {
   }

  ngOnInit() {
  }

  ngAfterViewInit(){
      this.child.keyEventInput.subscribe(e => {
        console.log('keyboard event:' + e.domEvent.keyCode + ', ' + e.key);

        const ev = e.domEvent;
        const printable = !ev.altKey && !ev.ctrlKey && !ev.metaKey;

        if (ev.keyCode === 13) {
          var output:string = this.interpret(this.child.underlying.buffer.getLine(this.child.underlying.buffer.cursorY).translateToString(true,2));
          if(output == null){
            this.child.underlying.clear();
          }
          else{
            this.child.write('\r\n' + output);
          }
          this.child.write('\r\n> ');
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

    interpret(line : string ){
      var output : string = "";
      switch(line[0]){
        case "h": output = "help()"; break;
        case "q": this.router.navigate(['']); break;
        case "a": output = "add(line)"; break;
        case "e": output = "edit(line)"; break;
        case "r": output = "remove(line)"; break;
        case "c": output = null; break;
        default: output = "Error: Invalid Command. Type \"h\" for help"; break;
      }
      return output;
  }
}
