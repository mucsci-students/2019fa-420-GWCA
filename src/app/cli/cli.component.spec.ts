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

  //will change soon (will be updated for file input)
  it('should have an input in the import box', () => {
    component.interpret('>import');
    component.openImport();
    var input = document.querySelector('form input');
    expect(input).not.toBeUndefined();
  });

});
