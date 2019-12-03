import { async, ComponentFixture, TestBed, } from '@angular/core/testing';
import { CliComponent } from './cli.component';
import { RouterTestingModule } from '@angular/router/testing';
import { Terminal } from 'xterm';
import { MatDialogModule, MatDialogRef, MatDialog, MatSelectModule, MatChipsModule, MatIconModule } from '@angular/material';
import { ComponentFactoryResolver } from '@angular/core';
import { DialogTestComponent } from '../dialog-test/dialog-test.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { FormsModule } from '@angular/forms';

describe('CliComponent', () => {
  let component: CliComponent;
  let fixture: ComponentFixture<CliComponent>;
  let componentFactoryResolver: ComponentFactoryResolver;


  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ 
        CliComponent,
        DialogTestComponent 
      ],
      imports: [ 
        RouterTestingModule,
        MatDialogModule,
        BrowserAnimationsModule,
        MatSelectModule,
        FormsModule,
        MatChipsModule,
        MatIconModule,
      ],
      providers: [{provide: MatDialogRef,useValue: {}}]
    }).overrideModule(BrowserDynamicTestingModule,{
      set: {
        entryComponents: [DialogTestComponent]
      }
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CliComponent);
    component = fixture.componentInstance;
    componentFactoryResolver = fixture.debugElement.injector.get(ComponentFactoryResolver);
    fixture.detectChanges();

  });

  it('should open the dialog box on import',() => {
    spyOn(component,'openImport');
    component.interpret('>import');
    expect(component.openImport).toHaveBeenCalled();
  });


  it('should open the import dialog box',() => {
    component.interpret('>import');
    component.openImport();
    expect(component.dialogRef.componentInstance.name).toBe('Import Button');
  });

  it('should be abele to call add',() => {
    spyOn(component, 'add');
    component.interpret('>add');
    expect(component.add).toHaveBeenCalled();
  });

  it('should be able to call view',() => {
    spyOn(component, 'viewDiagram');
    component.interpret('>view');
    expect(component.viewDiagram).toHaveBeenCalled();
  });

  it('should be able to call help',() => {
    spyOn(component, 'fullHelp');
    component.interpret('>help');
    expect(component.fullHelp).toHaveBeenCalled();
  });

  it('should be able to call edit',() => {
    spyOn(component, 'editClass');
    component.interpret('>edit');
    expect(component.editClass).toHaveBeenCalled();
  });

  it('should be able to call man',() => {
    spyOn(component, 'man');
    component.interpret('>man');
    expect(component.man).toHaveBeenCalled();
  });

  it('should be able to call remove',() => {
    spyOn(component, 'remove');
    component.interpret('>remove');
    expect(component.remove).toHaveBeenCalled();
  });

  it('should be able to call clone',() => {
    spyOn(component, 'cloneClass');
    component.interpret('>clone');
    expect(component.cloneClass).toHaveBeenCalled();
  });

  it('should be able to call neofetch',() => {
    spyOn(component, 'neofetch');
    component.interpret('>neofetch');
    expect(component.neofetch).toHaveBeenCalled();
  });

  it('should show man entry when add is called with no class name',() => {
    expect(component.interpret('>add')).toBe(component.man("add"));
  });

  it('should error if too many spaces are in add var',() => {
    expect(component.interpret('>add -v  hello')).toBe('\x1b[1;31m' + "Error: too many spaces between '-v' and class name");
  });

  it('should error if too many spaces are in add method',() => {
    expect(component.interpret('>add -m  hello')).toBe('\x1b[1;31m' + "Error: too many spaces between '-m' and class name");
  });

  it('should be able to add a class',() => {
    expect(component.interpret('>add hello')).toBe('\x1b[1;32m' + "New Blank class \"" + "hello" + "\" added!");
  });

  it('should be able to add a variable to class hello',() => {
    component.interpret('>add hello')
    expect(component.interpret('add -v hello int x')).toBe('\x1b[1;32m' + "Variable \"" + "int x" + "\" added to class \"" + "hello" + "\" successfully.");
  });

  it('should show man entry when remove is called with no class name',() => {
    expect(component.interpret('>remove')).toBe(component.man("remove"));
  });

  it('should be able to remove a class', () => {
    component.interpret(">add hello");
    expect(component.interpret(">remove hello")).toBe('\x1b[1;32m' + "Class \"" + "hello" + "\" removed!");
  });

  it('should be able to remove one var', () => {
    component.interpret(">add hello");
    component.interpret(">add -v hello int x");
    expect(component.interpret("remove -v hello x")).toBe('\x1b[1;32m' + "Variable \"" + "x" + "\" removed from class \"" + "hello" + "\" successfully.");
  });

  it('should be able to remove one method', () => {
    component.interpret(">add hello");
    component.interpret(">add -m hello print()");
    expect(component.interpret("remove -m hello print()")).toBe('\x1b[1;32m' + "Method \"" + "print()" + "\" removed from class \"" + "hello" + "\" successfully.");
  });

  it('should be able to remove all vars', () => {
    component.interpret(">add hello");
    component.interpret(">add -v hello int x");
    component.interpret(">add -v hello bool b");
    component.interpret(">add -v hello char c");
    expect(component.interpret("remove -v hello *")).toBe('\x1b[1;32m' + "Variables removed from class \"" + "hello" + "\" successfully.");
  });

  it('should be able to remove all methods', () => {
    component.interpret(">add hello");
    component.interpret(">add -m hello print()");
    component.interpret(">add -m hello push()");
    component.interpret(">add -m hello pop()");
    expect(component.interpret("remove -m hello *")).toBe('\x1b[1;32m' + "Methods removed from class \"" + "hello" + "\" successfully.");
  });

  it('should not be able to remove a method twice', () => {
    component.interpret(">add hello");
    component.interpret(">add -m hello print()");
    component.interpret(">remove -m hello print()");
    expect(component.interpret("remove -m hello print()")).toBe('\x1b[1;31m' + "Error: Class " + "hello" + " has no methods!");
  });

  it('should not be able to remove a var twice', () => {
    component.interpret(">add hello");
    component.interpret(">add -v hello int x");
    component.interpret("remove -v hello x")
    expect(component.interpret("remove -v hello x")).toBe('\x1b[1;31m' + "Error: Class " + "hello" + " has no variables!");
  });
  

  //will change soon (will be updated for file input)
  it('should have an input in the import box', () => {
    component.interpret('>import');
    component.openImport();
    var input = document.querySelector('form input');
    expect(input).not.toBeUndefined();
  });

});
