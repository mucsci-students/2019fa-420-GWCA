import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { NgTerminal, NgTerminalModule } from 'ng-terminal';
import { IBufferLine } from 'xterm';
import { Router } from '@angular/router';
import { ClassStorageService } from '../class-storage.service';

@Component({
  selector: 'app-cli',
  templateUrl: './cli.component.html',
  styleUrls: ['./cli.component.css']
})
export class CliComponent implements OnInit, AfterViewInit {
  @ViewChild('term', { static: true }) child: NgTerminal;

  constructor(private router : Router, public service : ClassStorageService ) {
   }

  ngOnInit() {
  }

  ngAfterViewInit(){
      this.child.write("Press ENTER to begin: \r\n");
      this.child.keyEventInput.subscribe(e => {
        console.log('keyboard event:' + e.domEvent.keyCode + ', ' + e.key);

        const ev = e.domEvent;
        const printable = !ev.altKey && !ev.ctrlKey && !ev.metaKey;

        if (ev.keyCode === 13) {
          var output:string = this.interpret(this.child.underlying.buffer.getLine(this.child.underlying.buffer.cursorY).translateToString(true,2));
          if(output == ""){
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

    //wrapper class to delete class from backend given classname to delete
    deleteClass(classname) {
	var deleted = this.service.deleteClass(classname);
	if (deleted == true) {
	    return classname + " successfully deleted\r\n";
	}
	else {
	    return "Please enter a valid class name to delete.\r\n";
	}
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
