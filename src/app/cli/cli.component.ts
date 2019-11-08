import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, ViewEncapsulation, HostListener } from '@angular/core';
import { Terminal} from 'xterm';
import { Router } from '@angular/router';
import { ClassStorageService, fullClass } from '../class-storage.service';
import { ArrayType, collectExternalReferences } from '@angular/compiler';
import { getMatTooltipInvalidPositionError } from '@angular/material';

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

  @HostListener('document:keyup', ['$event'])
  handleDeleteKeyboardEvent(event: KeyboardEvent) {
    if(event.keyCode === 13){
      var output = this.interpret(this.input, this.term);
      if(output == ""){
        this.term.reset();
      }
      else{
        this.term.write('\r\n');
        this.term.write(output);
      }
      this.input = '';
      this.term.write('\x1b[1;37m' + '\r\n>');
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
    this.term = new Terminal({ 
      fontSize: 48,
      fontFamily: 'OCR A Std, monospace',
      cursorBlink: true,
      cursorStyle: "block",
      rightClickSelectsWord: true});
    this.term.open(this.terminalDiv.nativeElement);
    this.term.write('\x1b[1;35m' + "\t\t\t\tWelcome To GNUML! \r\n" + '\x1b[1;37m');
    this.term.write(this.fullHelp());
    this.term.write('\x1b[1;37m' + '\r\n>');
  }

  ngAfterViewInit(){}


  //this function taken in our input line, grabs the char that is a command, and runs it's corresponding code
  interpret(line: string, currTerm: Terminal){
    var output: string = "";
    var input = line.replace(">","").split(" ");
    switch(input[0]){
      case "help": output = this.fullHelp(); break;
      case "man": output = this.man(input[1]); break;
      case "quit": this.router.navigate(['']); break;
      case "exit": this.router.navigate(['']); break;
      case "add": output = this.add(line); break;
      case "edit": output = this.editClass(line); break;
      case "remove": output = this.removeClass(line); break;
      case "clear": output = ""; break;
      case "view": output = this.viewDiagram(); break;
      case "export": output = "copy this: " + this.exportDiagram(); break;
      case "clone": output = this.cloneClass(line); break;
      case "neofetch": output = this.neofetch(); break;
      case "": output = '\x1b[1;31m' + "Error: Invalid Command. Type \"help\" for commands"; break;
      default: output = '\x1b[1;31m' + "Error: Invalid Command \'" + input[0] + "\' Type \"help\" for commands"; break;
    }
    return output;
  }

  //this function prints out our help message
  man(command: string){
    var manmsg: string = "";
    switch(command){
      case "help":  
        manmsg = '\x1b[1;33m' + "You may need more help than I can offer..."; 
        break;
      case "quit":  
        manmsg = '\x1b[1;33m' + "Format:\tquit"; 
        break;
      case "add":   
        manmsg = '\x1b[1;33m' + `Formats:\n\r  Classes:   add <class_name>\n\r  Variables: add -v <class_name> <var_name>\n\r  Methods:   add -m <class_name> <method_name>`; break;
      case "edit":  manmsg = '\x1b[1;33m' + "Format:\tedit <class_name> [var1,var2,...] [method1(),method2(),...]"; break;
      case "remove": manmsg = '\x1b[1;33m' + "Format:\tremove <class_name>"; break;
      case "clear": manmsg = '\x1b[1;33m' + "Format:\tclear"; break;
      case "view":  manmsg = '\x1b[1;33m' + "Format:\tview"; break;
      case "export": manmsg = '\x1b[1;33m' + "Format:\texport"; break;
      case "neofetch": manmsg = '\x1b[1;33m' + "Format:\tneofetch"; break;
      default:  manmsg = '\x1b[1;33m' + "Format:\tman <command>"; break;
    }
    return manmsg;
  }

  fullHelp(){
    return ` Commands:\r
 ---------\r
 add      -> add a class or attribute\r
 clear    -> clear the screen\r
 clone    -> clone a class\r
 edit     -> edit a class\r
 export   -> export diagram\r
 help     -> print help message\r
 man      -> view a command's manual page\r
 neofetch -> view system information\r
 quit     -> quit and return to GUI\r
 remove   -> remove a class\r
 view     -> view diagram\r
\x1b[1;33mtype "help <command>" for further info\r`;
  }

  //  this function adds a blank class with the given name.
  add(line: string){
    var command = line.split(" ");
    var name = command[1];
    if (name){
      if(name == "-v" || name == "-m"){
        var addition = this.service.findClass(command[2]);
        if(addition){
            if(name == "-v" && command.length == 5){
              var varName = command[3] + " " + command[4];
              if(addition.variables[0] == "none"){
                addition.variables.pop();
              }
              addition.variables.push(varName);
              return '\x1b[1;32m' + "Variable \"" + varName + "\" added to class \"" + name + "\" successfully."
            }
            else if(name == "-v" && command.length != 5){
              return '\x1b[1;33m' + "Format:\tadd -v <class_name> <var_name>";
            }
            else if(name == "-m" && command.length == 4){
             var methodName = command[3];
             if(addition.methods[0] == "none"){
              addition.methods.pop();
            }
            addition.methods.push(methodName);
            return '\x1b[1;32m' + "Method \"" + methodName + "\" added to class \"" + name + "\" successfully."
            }
          }
          else{
            return '\x1b[1;31m' + "Error: Class \"" + name + "\" cannot be found.";
          }
      }
      else{
        var addition = this.service.findClass(name);
        if(addition){
          return '\x1b[1;31m' + "Error: Class \"" + name + "\" already exists.";
        }
        else{
          this.service.createNew(name, ["none"], ["none"]);
          return '\x1b[1;32m' + "New Blank class \"" + name + "\" added!";
        }
      }
    }
    else{
      return '\x1b[1;33m' + "Format:\tadd <class_name>";
    }
  }

  //  this takes in a class name, and what you want
  editClass(line: string){
    var targetName = this.grabClassNameFromInput(line);
    var targetClass = this.service.findClass(targetName);
    var addedClass = false;
    if(!targetClass){
      this.add(line);
      var targetClass = this.service.findClass(targetName);
      addedClass = true;
    }
    var choppedLine = line.split(" ");
    var bracketLine = line.split("[");
    console.log("bl length: " + bracketLine.length);
    if(choppedLine.length < 3 || bracketLine.length < 3){
      return '\x1b[1;33m' + "Format:\tedit <class_name> [var1,var2,...] [method1(),method2(),...]";
    }
    else{
      var inputVariables = bracketLine[1]
      inputVariables = inputVariables.replace("]","");
      this.updateAttribute(targetClass, inputVariables, "variables");

      var inputMethods = bracketLine[2]; 
      inputMethods = inputMethods.replace("]","");
      this.updateAttribute(targetClass, inputMethods, "methods");

      if(addedClass){
        return '\x1b[1;33m' + "Class \"" + targetName + "\" did not exist, so it has been added.";
      }
      else{
        return '\x1b[1;32m' + "Class \"" + targetName + "\" attributes have been updated.";
      }
    }

  }

  //  this funtion removes a class with the given name.
  removeClass(line: string){
    var targetName = this.grabClassNameFromInput(line);
    if (targetName){
      var target = this.service.findClass(targetName);
      if(target){
        this.service.removeClassByIndex(this.service.allClasses.indexOf(target));
        return '\x1b[1;32m' + "Class \"" + targetName + "\" has been deleted";
      }
      else{
        return '\x1b[1;31m' + "Error: Class \"" + targetName + "\" not found. Type 'view' to view classes.";
      }
    }
    else{
      return '\x1b[1;33m' + "Format:\tremove <class_name>";
    }
  }

  //  This prints the current diagram to the screen in an (arguably) human-readable format.
  viewDiagram(){
    var diagram:string = '\x1b[1;36m';
    let regex = /\n/gi
    for(var i = 0; i < this.service.allClasses.length; i++){
        diagram += "---------------------------------------------------\r\n";
        diagram += "Class:\t\t" + this.service.allClasses[i].name + "\r\n";
        diagram += "Methods:\t" + this.service.allClasses[i].methods.toString().replace(regex, " ") + "\r\n";
        diagram += "Variables:\t" + this.service.allClasses[i].variables.toString().replace(regex, " ") + "\r\n";
        diagram += "Connections:\t" + this.service.allClasses[i].connections.toString().replace(regex, " ") + "\r\n";
        diagram += "---------------------------------------------------\r\n";
        diagram += "\n";
    }
    return diagram;
  }

  //this outputs the current JSON to the terminal screen
  exportDiagram(){
    this.service.diagramToJSON();
    return this.service.jsonString;
  }

  //  this takes the name of a given class and a "new" name. It copies the class, 
  //  renaming it to the "new" name in the process
  cloneClass(line: string){
    var targetName = this.grabClassNameFromInput(line);
    var targetClass = this.service.findClass(targetName);
    var choppedLine = line.split(" ");
    console.log(choppedLine[2]);
    if(choppedLine.length < 2){
      return '\x1b[1;33m' + "Format:\tclone <class_name> <clone_name>";
    }
    else{
      this.service.createNew(choppedLine[2], targetClass.methods, targetClass.variables);
      return '\x1b[1;32m' + "Class \"" + targetName + "\" cloned successfully.";
    }
  }


  // this helper function grabs the class name from commands that include one
  grabClassNameFromInput(line: string){
    var splitLine = line.split(" ");
    var name = splitLine[1];
    return name;
  }

  //  this is a helper for edit. It updates the attribute of a given class with the passed in value.
  updateAttribute(target: fullClass, value: string, field: string){
    switch(field){
      case "variables":
        this.updateVariables(target, value);
        break;
      case "methods":
        this.updateMethods(target, value);
        break;
      default:
        break;
    }
  }

  neofetch(){
    return '\x1b[1;31m' + `⣿⣿⣿⣿⣿⣿⣿⡿⢟⣋⣭⣥⣭⣭⣍⡉⠉⠙⠛⠻⠿⣿⣿⣿⣿⣿⣿⣿⣿⣿\r
⣿⣿⣿⣿⣿⡏⠁⠠⠶⠛⠻⠿⣿⣿⣿⣿⣷⡄⠄⠄⠄⠄⠉⠻⢿⣿⣿⣿⣿⣿\r
⣿⣿⣿⣿⠟⠄⢀⡴⢊⣴⣶⣶⣾⣿⣿⣿⣿⢿⡄⠄⠄⠄⠄⠄⠄⠙⢿⣿⣿⣿\r
⣿⣿⡿⠁⠄⠙⡟⠁⣾⣿⣿⣿⣿⣿⣿⣿⣿⣎⠃⠄⠄⠄⠄⠄⠄⠄⠈⢻⣿⣿\r
⣿⡟⠄⠄⠄⠄⡇⠰⠟⠛⠛⠿⠿⠟⢋⢉⠍⢩⣠⡀⠄⠄⠄⠄⠄⠄⠄⠄⢹⣿\r
⣿⠁⠄⠄⠄⠄⠰⠁⣑⣬⣤⡀⣾⣦⣶⣾⣖⣼⣿⠁⠄⠄⠄⠄⠄⠄⠄⠄⠄⢿\r
⡏⠄⠄⠄⠄⠄⠄⠄⠨⣿⠟⠰⠻⠿⣣⡙⠿⣿⠋⠄⢀⡀⣀⠄⣀⣀⢀⣀⣀⢸\r
⡇⠄⠄⠄⠄⠄⠄⠄⠄⣠⠄⠚⠛⠉⠭⣉⢁⣿⠄⢀⡿⢾⣅⢸⡗⠂⢿⣀⡀⢸\r
⡇⠄⠄⠄⠄⠄⠄⠄⠄⠘⢧⣄⠄⣻⣿⣿⣾⠟⣀⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⢸\r
⣿⠄⠄⠄⠄⠄⠄⠄⠄⢠⡀⠄⠄⣿⣿⠟⢁⣴⣿⢸⡄⠄⢦⣤⣤⣤⣤⣄⡀⣼\r
⣿⣧⠄⠄⠄⠄⠄⠄⢠⡸⣿⠒⠄⠈⠛⠄⠁⢹⡟⣾⡇⠄⠈⢿⣿⣿⣿⣿⣿⣿\r
⣿⣿⣧⣠⣴⣦⠄⠄⢸⣷⡹⣧⣖⡔⠄⠱⣮⣻⣷⣿⣿⠄⠄⠘⣿⣿⣿⣿⣿⣿\r
⣿⣿⣿⣿⣿⡇⠄⠄⠸⠿⠿⠚⠛⠁⠂⠄⠉⠉⡅⢰⡆⢰⡄⠄⠘⣿⣿⣿⣿⣿\r
⣿⣿⣿⣿⣿⣷⣤⡀⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⣿⠄⣷⠘⣧⣠⣾⣿⣿⣿⣿⣿\r
⣿⣿⣿⣿⣿⣿⣿⣿⣷⣦⣤⣄⣀⣀⡀⠄⣀⣀⣹⣦⣽⣾⣿⣿⣿⣿⣿⣿⣿⣿\r` + '\x1b[1;35m' + `\nGNUML COLONEL VERSION:\t3.0.0\n\r`

  }
  //  this updates the variables of the passed in class with the passed in values
  updateVariables(target: fullClass, values: string){
    var valsArray = values.split(",");
    target.variables.length = 0;
    console.log("\'"+valsArray[0]+"\"");
    if(valsArray[0] == " "){
      target.variables.push("none");
    }
    else{
      for(var i = 0; i < valsArray.length; i++){
        target.variables.push(valsArray[i]);
      }
    }
  }

  //  this updates the methods of the passed in class with the passed in methods
  updateMethods(target: fullClass, methods: string){
    var methodsArray = methods.split(",");
    target.methods.length = 0;
    if(methodsArray[0] == ""){
      target.methods.push("none");
    }
    else{
      for(var i = 0; i < methodsArray.length; i++){
        target.methods.push(methodsArray[i]);
      }
    }
  }
}
