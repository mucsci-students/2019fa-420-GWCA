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
    spyOn(component, 'removeClass');
    component.interpret('>remove');
    expect(component.removeClass).toHaveBeenCalled();
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

  it('should show format tip when add is called with no class name',() => {
    expect(component.interpret('>add')).toBe('\x1b[1;33m' + "Format: add <class_name>");
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


  //will change soon (will be updated for file input)
  it('should have an input in the import box', () => {
    component.interpret('>import');
    component.openImport();
    var input = document.querySelector('form input');
    expect(input).not.toBeUndefined();
  });

});
