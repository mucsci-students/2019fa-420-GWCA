import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, ViewEncapsulation, HostListener } from '@angular/core';
import { Terminal} from 'xterm';
import { Router } from '@angular/router';
import { ClassStorageService, fullClass } from '../class-storage.service';
import { ArrayType, collectExternalReferences } from '@angular/compiler';
import { getMatTooltipInvalidPositionError, MatDialogRef, MatDialog } from '@angular/material';
import { DialogTestComponent } from '../dialog-test/dialog-test.component';

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
  dialogRef:MatDialogRef<DialogTestComponent>;
  @ViewChild('terminal',{static:true}) terminalDiv: ElementRef;

  @HostListener('document:keyup', ['$event'])
  handleDeleteKeyboardEvent(event: KeyboardEvent) {
    if(event.keyCode === 13){
      var output = this.interpret(this.input);
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

  constructor(private router : Router, public service : ClassStorageService,
    public dialog: MatDialog ) {
   }

  ngOnInit() {
    this.input = '';
    this.term = new Terminal({ 
      fontSize: 48,
      fontFamily: 'monospace',
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
  interpret(line : string){
    var output : string = "";
    var input = line.replace(">","").split(" ");
    switch(input[0]){
      case "help": output = this.fullHelp(); break;
      case "man": output = this.man(input[1]); break;
      case "quit": this.router.navigate(['']); break;
      case "exit": this.router.navigate(['']); break;
      case "add": output = this.add(line); break;
      case "edit": output = this.editClass(line); break;
      case "remove": output = this.remove(line); break;
      case "clear": output = ""; break;
      case "view": output = this.viewDiagram(); break;
      case "import": output = this.openImport(); break;
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
        manmsg = '\x1b[1;33m' + `Formats:\n\r  Classes:   add <class_name>\n\r  Variables: add -v <class_name> <var_type> <var_name>\n\r  Methods:   add -m <class_name> <method_name>`; break;
      case "edit":  manmsg = '\x1b[1;33m' + "Format:\tedit <class_name> [var1,var2,...] [method1(),method2(),...]"; break;
      case "remove": 
      manmsg = '\x1b[1;33m' + `Formats:\n\r  Classes:   remove <class_name>\n\n\r  Variables: remove -v <class_name> <var_name> \n\r\t     remove -v <class_name> *\n\n\r  Methods:   remove -m <class_name> <method_name> \n\r\t     remove -m <class_name> *`; break;
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
 import   -> import a diagram\r
 man      -> view a command's manual page\r
 neofetch -> view system information\r
 quit     -> quit and return to GUI\r
 remove   -> remove a class\r
 view     -> view diagram\r
\x1b[1;33m type "help <command>" for further info\r`;
 }

  //  this function adds a blank class with the given name.
  add(line: string){
    var command = line.split(" ");
    var name = command[1];
    var flag = "";
    if (name){
      if(name == "-v" || name == "-m"){
        flag = name;
        name = command[2];
        var addition = this.service.findClass(name);
        if(addition){
            if(flag == "-v" && command.length == 5){
              var varName = command[3] + " " + command[4];
              if(addition.variables[0] == "none"){
                addition.variables.pop();
              }
              addition.variables.push(varName);
              return '\x1b[1;32m' + "Variable \"" + varName + "\" added to class \"" + name + "\" successfully."
            }
            else if(flag == "-v" && command.length != 5){
              return '\x1b[1;33m' + "Format: add -v <class_name> <var_type> <var_name>";
            }
            else if(flag == "-m" && command.length == 4){
             var methodName = command[3];
             if(addition.methods[0] == "none"){
              addition.methods.pop();
            }
            addition.methods.push(methodName);
            return '\x1b[1;32m' + "Method \"" + methodName + "\" added to class \"" + name + "\" successfully."
            }
          }
          else if(name == "" && flag == "-v"){
            return '\x1b[1;31m' + "Error: too many spaces between '-v' and class name";
          }
          else if(name == "" && flag == "-m"){
            return '\x1b[1;31m' + "Error: too many spaces between '-m' and class name";
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
      return this.man("add");
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
  remove(line: string){
    var command = line.split(" ");
    var name = command[1];
    var flag = "";
    if (name){
      if(name == "-v" || name == "-m"){
        flag = name;
        name = command[2];
        var target = this.service.findClass(name);
        if(target){
            if(flag == "-v" && command.length == 4){
              var varName = command[3];
              if(target.variables[0] == "none"){
                return '\x1b[1;31m' + "Error: Class " + name + " has no variables!";
              }
              else if(varName == "*"){
                this.service.removeAllAttribute(target, "variables");
                target.variables.push("none");
                return '\x1b[1;32m' + "Variables removed from class \"" + name + "\" successfully."
              }
              else if(this.service.removeAttribute(target, "variables", this.service.findVarIndex(target, varName))){
                if(target.variables.length < 1){
                  target.variables.push("none");
                }
                return '\x1b[1;32m' + "Variable \"" + varName + "\" removed from class \"" + name + "\" successfully."
              }
              else{
                return '\x1b[1;31m' + "Error: Variable " + varName + " could not be removed from class " + name;
              }

            }
            else if(flag == "-v" && command.length != 4){
              return this.man("remove");
            }
            else if(flag == "-m" && command.length == 4){
             var methodName = command[3];
             if(target.methods[0] == "none"){
              return '\x1b[1;31m' + "Error: Class " + name + " has no methods!"; 
             }
             else if(methodName == "*"){
               this.service.removeAllAttribute(target, "methods");
               target.methods.push("none");
               return '\x1b[1;32m' + "Methods removed from class \"" + name + "\" successfully."

             }
             else if(this.service.removeAttribute(target, "methods", this.service.findMethIndex(target, methodName))){
               if(target.methods.length < 1){
                  target.methods.push("none");
                }
                return '\x1b[1;32m' + "Method \"" + methodName + "\" removed from class \"" + name + "\" successfully."
             }
             else{
              return '\x1b[1;31m' + "Error: Method " + methodName + " could not be removed from class " + name;
            }
            }
          }
          else if(name == "" && flag == "-v"){
            return '\x1b[1;31m' + "Error: too many spaces between '-v' and class name";
          }
          else if(name == "" && flag == "-m"){
            return '\x1b[1;31m' + "Error: too many spaces between '-m' and class name";
          }
          else{
            return '\x1b[1;31m' + "Error: Class \"" + name + "\" cannot be found.";
          }
      }
      else{
        var target = this.service.findClass(name);
        if(!target){
          return '\x1b[1;31m' + "Error: Class \"" + name + "\" does not exist.";
        }
        else{
          this.service.removeClassByIndex(this.service.findClassIndex(name));
          return '\x1b[1;32m' + "Class \"" + name + "\" removed!";
        }
      }
    }
    else{
      //return '\x1b[1;33m' + "Format:\tadd <class_name>";
      return this.man("remove");
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

  //   outputs "system status" information
  neofetch(){
    console.log(this.getBrowserName());
    return '\x1b[1;31m' + `⣿⣿⣿⣿⣿⣿⣿⡿⢟⣋⣭⣥⣭⣭⣍⡉⠉⠙⠛⠻⠿⣿⣿⣿⣿⣿⣿⣿⣿⣿\r
⣿⣿⣿⣿⣿⡏⠁⠠⠶⠛⠻⠿⣿⣿⣿⣿⣷⡄⠄⠄⠄⠄⠉⠻⢿⣿⣿⣿⣿⣿` + '\x1b[1;35m' + `\tColonel:\tGNUML 3.0.0\n\r` + '\x1b[1;31m' +
`⣿⣿⣿⣿⠟⠄⢀⡴⢊⣴⣶⣶⣾⣿⣿⣿⣿⢿⡄⠄⠄⠄⠄⠄⠄⠙⢿⣿⣿⣿` + '\x1b[1;35m' + `\tTERMINAL:\tGNUML\n\r` + '\x1b[1;31m' +
`⣿⣿⡿⠁⠄⠙⡟⠁⣾⣿⣿⣿⣿⣿⣿⣿⣿⣎⠃⠄⠄⠄⠄⠄⠄⠄⠈⢻⣿⣿` + '\x1b[1;35m' + `\tTERMINAL FONT:\tMonospace\n\r` + '\x1b[1;31m' +
`⣿⡟⠄⠄⠄⠄⡇⠰⠟⠛⠛⠿⠿⠟⢋⢉⠍⢩⣠⡀⠄⠄⠄⠄⠄⠄⠄⠄⢹⣿` + '\x1b[1;35m' + `\tBrowser:\t` + this.getBrowserName() +`\n\r` + '\x1b[1;31m' +
`⣿⠁⠄⠄⠄⠄⠰⠁⣑⣬⣤⡀⣾⣦⣶⣾⣖⣼⣿⠁⠄⠄⠄⠄⠄⠄⠄⠄⠄⢿\r
⡏⠄⠄⠄⠄⠄⠄⠄⠨⣿⠟⠰⠻⠿⣣⡙⠿⣿⠋⠄⢀⡀⣀⠄⣀⣀⢀⣀⣀⢸\r
⡇⠄⠄⠄⠄⠄⠄⠄⠄⣠⠄⠚⠛⠉⠭⣉⢁⣿⠄⢀⡿⢾⣅⢸⡗⠂⢿⣀⡀⢸\r
⡇⠄⠄⠄⠄⠄⠄⠄⠄⠘⢧⣄⠄⣻⣿⣿⣾⠟⣀⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⢸\r
⣿⠄⠄⠄⠄⠄⠄⠄⠄⢠⡀⠄⠄⣿⣿⠟⢁⣴⣿⢸⡄⠄⢦⣤⣤⣤⣤⣄⡀⣼\r
⣿⣧⠄⠄⠄⠄⠄⠄⢠⡸⣿⠒⠄⠈⠛⠄⠁⢹⡟⣾⡇⠄⠈⢿⣿⣿⣿⣿⣿⣿\r
⣿⣿⣧⣠⣴⣦⠄⠄⢸⣷⡹⣧⣖⡔⠄⠱⣮⣻⣷⣿⣿⠄⠄⠘⣿⣿⣿⣿⣿⣿\r
⣿⣿⣿⣿⣿⡇⠄⠄⠸⠿⠿⠚⠛⠁⠂⠄⠉⠉⡅⢰⡆⢰⡄⠄⠘⣿⣿⣿⣿⣿\r
⣿⣿⣿⣿⣿⣷⣤⡀⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⣿⠄⣷⠘⣧⣠⣾⣿⣿⣿⣿⣿\r
⣿⣿⣿⣿⣿⣿⣿⣿⣷⣦⣤⣄⣀⣀⡀⠄⣀⣀⣹⣦⣽⣾⣿⣿⣿⣿⣿⣿⣿⣿\r`

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

  // this does the browser detection for our neofetch command
  getBrowserName() {
  const agent = window.navigator.userAgent.toLowerCase()
  switch (true) {
    case agent.indexOf('edge') > -1:
      return 'Edge';
    case agent.indexOf('opr') > -1 && !!(<any>window).opr:
      return 'Opera';
    case agent.indexOf('chrome') > -1 && !!(<any>window).chrome:
      return 'Chrome';
    case agent.indexOf('trident') > -1:
      return 'Internet Explorer';
    case agent.indexOf('firefox') > -1:
      return 'Firefox';
    case agent.indexOf('safari') > -1:
      return 'Safari';
    default:
      return '*notices niche browser* UwU what\'s this??';
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


  //open modal for dialog
  openImport(){
    this.dialogRef = this.dialog.open(DialogTestComponent, {width: '30%'});
    this.dialogRef.componentInstance.buttonPressed = "import";
    this.dialogRef.componentInstance.name = "Import Button";
    return 'Opening Dialog...\n';

  }

}
