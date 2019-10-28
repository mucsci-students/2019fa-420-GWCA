import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, ViewEncapsulation, HostListener } from '@angular/core';
import { NgTerminal} from 'ng-terminal';
import { Terminal} from 'xterm';
import { Router } from '@angular/router';
import { ClassStorageService } from '../class-storage.service';

@Component({
  selector: 'app-cli',
  templateUrl: './cli.component.html',
  styleUrls: [
    './cli.component.css',
    ],
  encapsulation: ViewEncapsulation.None,
})
export class CliComponent implements OnInit, AfterViewInit {
  term: Terminal;
  input: string; //actual string to read
  @ViewChild('terminal',{static:true}) terminalDiv: ElementRef;
  @ViewChild('term', { static: true }) child: NgTerminal;

  @HostListener('document:keyup', ['$event'])
  handleDeleteKeyboardEvent(event: KeyboardEvent) {
    if(event.keyCode === 13){
      var output = this.interpret(this.input);
      if(output == ""){
        this.term.clear();
      }
      else{
        this.term.write('\r\n');
        this.term.writeln(output);
      }
      this.input = '';
      this.term.write('\r\n$');
    }
    else if(event.keyCode === 8){
      this.term.write('\b \b');
      this.input = this.input.substring(0,this.input.length - 1);
    }
    else{
      if(event.key != 'Shift'){
        this.term.write(event.key);
        this.input = this.input + event.key;
      }
    }
  }



  constructor(private router : Router, public service : ClassStorageService ) {
   }

  ngOnInit() {
    this.input = '';
    this.term = new Terminal;
    this.term.open(this.terminalDiv.nativeElement);
    this.term.write('\r\n$');
    



  }

  ngAfterViewInit(){
    
      // this.child.write("Press ENTER to begin: \r\n");
      // this.child.keyEventInput.subscribe(e => {
      //   console.log('keyboard event:' + e.domEvent.keyCode + ', ' + e.key);

      //   const ev = e.domEvent;
      //   const printable = !ev.altKey && !ev.ctrlKey && !ev.metaKey;

      //   if (ev.keyCode === 13) {
      //     var output:string = this.interpret(this.child.underlying.buffer.getLine(this.child.underlying.buffer.cursorY).translateToString(true,2));
      //     if(output == ""){
      //       this.child.underlying.clear();
      //     }
      //     else{
      //       this.child.write('\r\n' + output);
      //     }
      //     this.child.write('\r\n> ');
      //   } else if (ev.keyCode === 8) {
      //     // Do not delete the prompt
      //     if (this.child.underlying.buffer.cursorX > 2) {
      //       this.child.write('\b \b');
      //     }
      //   } else if (printable) {
      //     this.child.write(e.key);
      //   }
      // })
    }


    //this function taken in our input line, grabs the char that is a command, and runs it's corresponding code
    interpret(line : string ){
      var output : string = "";
      switch(line[0]){
        case "h": output = this.help(); break;
        case "q": this.router.navigate(['']); break;
        case "a": output = "This will add a class [incomplete]"; break;
        case "e": output = "This will add a edit [incomplete]"; break;
        case "r": output = "This will add a remove [incomplete]"; break;
        case "c": output = ""; break;
        case "v": output = this.viewDiagram(); break;
        case "x": output = "copy this: " + this.exportDiagram(); break;
        default: output = "Error: Invalid Command. Type \"h\" for help"; break;
      }
      return output;
  }

  //this outputs the current JSON to the terminal screen
  exportDiagram(){
    this.service.diagramToJSON();
    return this.service.jsonString;
  }

  //This prints the current diagram to the screen in a human-readable format
  //To "view" a diagram, you have to add a class through the gui first, as the CLI add is incomplete
  viewDiagram(){
    var diagram:string = "\n";
    let regex = /\n/gi
    for(var i = 0; i < this.service.allClasses.length; i++){
        diagram += "---------------------------------------------------\r\n";
        diagram += "Class: " + this.service.allClasses[i].name + "\r\n";
        diagram += "Methods: " + this.service.allClasses[i].methods.toString().replace(regex, " ") + "\r\n";
        diagram += "Variables: " + this.service.allClasses[i].variables.toString().replace(regex, " ") + "\r\n";
        diagram += "---------------------------------------------------\r\n";
        diagram += "\n";
    }
    return diagram;
  }
  
  //this function prints out our help message
  help(){
    return `    Commands:\r
    ---------\r
    a -> add a class\r
    c -> clear the screen\r
    e -> edit a class\r
    h -> print help message\r
    q -> quit and return to GUI\r
    r -> remove a class\r
    v -> view diagram\r
    x -> export diagram\r`
  }
}
