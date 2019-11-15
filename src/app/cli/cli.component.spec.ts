import { async, ComponentFixture, TestBed, } from '@angular/core/testing';
import { CliComponent } from './cli.component';
import { RouterTestingModule } from '@angular/router/testing';
import { Terminal } from 'xterm';
import { MatDialogModule, MatDialogRef } from '@angular/material';
import { ComponentFactoryResolver } from '@angular/core';

describe('CliComponent', () => {
  let component: CliComponent;
  let fixture: ComponentFixture<CliComponent>;
  let componentFactoryResolver: ComponentFactoryResolver;


  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CliComponent ],
      imports: [ 
        RouterTestingModule,
        MatDialogModule,
      ],
      providers: [{provide: MatDialogRef}]
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
});
