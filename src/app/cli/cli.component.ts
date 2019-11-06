import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, ViewEncapsulation, HostListener } from '@angular/core';
import { Terminal} from 'xterm';
import { Router } from '@angular/router';
import { ClassStorageService, fullClass } from '../class-storage.service';
import { ArrayType, collectExternalReferences } from '@angular/compiler';
import { getMatTooltipInvalidPositionError } from '@angular/material';
import { delay } from 'q';

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
    this.term = new Terminal();
    this.term.open(this.terminalDiv.nativeElement);
    this.term.write('\x1b[1;37m' + '\r\n>');
  }

  ngAfterViewInit(){
    }


    //this function taken in our input line, grabs the char that is a command, and runs it's corresponding code
    interpret(line : string, currTerm: Terminal){
      var output : string = "";
      var input = line.replace(">","").split(" ");
      switch(input[0]){
        case "help": output = this.help(); break;
        case "quit": this.router.navigate(['']); break;
        case "add": output = this.addClass(line); break;
        case "edit": output = this.editClass(line); break;
        case "remove": output = this.removeClass(line); break;
        case "clear": output = ""; break;
        case "view": output = this.viewDiagram(); break;
        case "export": output = "copy this: " + this.exportDiagram(); break;
        case "clone": output = this.cloneClass(line); break;
        default: output = '\x1b[1;31m' + "Error: Invalid Command. Type \"help\" for help"; break;
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
    var diagram:string = '\x1b[1;36m';
    let regex = /\n/gi
    for(var i = 0; i < this.service.allClasses.length; i++){
        diagram += "---------------------------------------------------\r\n";
        diagram += "Class:\t\t" + this.service.allClasses[i].name + "\r\n";
        diagram += "Methods:\t" + this.service.allClasses[i].methods.toString().replace(regex, " ") + "\r\n";
        diagram += "Variables:\t" + this.service.allClasses[i].variables.toString().replace(regex, " ") + "\r\n";
        diagram += "---------------------------------------------------\r\n";
        diagram += "\n";
    }
    return diagram;
  }

  //this function take in the input line, returns a class name for methods that require it.
  grabClassNameFromInput(line: string){
    var splitLine = line.split(" ");
    var name = splitLine[1];
    return name;
  }

  //this function adds a blank class with the given name.
  addClass(line: string){
    var name = this.grabClassNameFromInput(line);
    if (name){
      var additon = this.selectClass(name);
      if(additon){
        return '\x1b[1;31m' + "Error: Class \"" + name + "\" already exists.";
      }
      else{
        this.service.createNew(name, ["none"], ["none"]);
        return '\x1b[1;32m' + "New Blank class \"" + name + "\" added! Use \'edit " + name + "\...' to configure attributes.";
      }
    }
    else{
      return '\x1b[1;31m' + "Error:\tInvalid Syntax." + '\x1b[1;33m' + "\n\rFormat:\tadd <class_name>";
    }
  }

  //this funtion removes a class with the given name.
  removeClass(line: string){
    var targetName = this.grabClassNameFromInput(line);
    if (targetName){
      var target = this.selectClass(targetName);
      if(target){
        this.service.removeClassByIndex(this.service.allClasses.indexOf(target));
        return '\x1b[1;32m' + "Class \"" + targetName + "\" has been deleted";
      }
      else{
        return '\x1b[1;31m' + "Error: Class \"" + targetName + "\" not found. Type 'view' to view classes.";
      }
    }
    else{
      return '\x1b[1;31m' + "Error:\tInvalid Syntax." + '\x1b[1;33m' + "\n\rFormat:\tremove <class_name>";
    }
  }

  //this grabs a class by name and returns it.
  selectClass(name: string){
    return this.service.findClass(name);
  }

  //this takes in a class name, and what you want
  editClass(line: string){
    var targetName = this.grabClassNameFromInput(line);
    var targetClass = this.selectClass(targetName);
    var addedClass = false;
    if(!targetClass){
      this.addClass(line);
      var targetClass = this.selectClass(targetName);
      addedClass = true;
    }
    var choppedLine = line.split(" ");
    var bracketLine = line.split("[");
    console.log("bl length: " + bracketLine.length);
    if(choppedLine.length < 3 || bracketLine.length < 3){
      return '\x1b[1;31m' + "Error:\tInvalid Syntax." + '\x1b[1;33m' + "\n\rFormat:\tedit <class_name> [var1,var2,...] [method1(),method2,...]";
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

  //this is a helper for edit. It updates the attribute of a given class with the passed in value.
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

  //this updates the variables of the passed in class with the passed in values
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

  //this updates the methods of the passed in class with the passed in methods
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

  cloneClass(line: string){
    var targetName = this.grabClassNameFromInput(line);
    var targetClass = this.selectClass(targetName);
    var choppedLine = line.split(" ");
    console.log(choppedLine[2]);
    if(choppedLine.length < 2){
      return '\x1b[1;31m' + "Error:\tInvalid Syntax." + '\x1b[1;33m' + "\n\rFormat:\tclone <class_name> <clone_name>";
    }
    else{
      this.service.createNew(choppedLine[2], targetClass.methods, targetClass.variables);
      return '\x1b[1;32m' + "Class \"" + targetName + "\" cloned successfully.";
    }

  }

  //this function prints out our help message
  help(){
    return `    Commands:\r
    ---------\r
    add    -> add a class:\r
    clear  -> clear the screen\r
    clone  -> clone a class\r
    edit   -> edit a class\r
    export -> export diagram\r
    help   -> print help message\r
    quit   -> quit and return to GUI\r
    remove -> remove a class\r
    view   -> view diagram\r`
  }
}
