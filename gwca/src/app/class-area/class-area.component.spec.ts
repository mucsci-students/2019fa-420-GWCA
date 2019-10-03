import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassAreaComponent } from './class-area.component';
import { MatDialogModule, MatSelectModule, MatDialogRef } from '@angular/material';
import { ClassStorageService, fullClass } from '../class-storage.service';
import { ClassBoxComponent } from '../class-box/class-box.component';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { ComponentFactoryResolver, DebugElement } from '@angular/core';
import { jsPlumb } from 'jsPlumb';

describe('ClassAreaComponent', () => {
  let component: ClassAreaComponent;
  let fixture: ComponentFixture<ClassAreaComponent>;
   let componentFactoryResolver: ComponentFactoryResolver;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ 
        ClassAreaComponent,
        ClassBoxComponent,
    ],
      imports: [
        MatDialogModule,
        MatSelectModule,
        MatDialogModule,
        
      ],
      providers: [{provide: MatDialogRef,ClassStorageService, useValue: {}},],
    }).compileComponents();

    TestBed.overrideModule(BrowserDynamicTestingModule, {
      set: {
        entryComponents: [ClassBoxComponent]}});

    TestBed.compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClassAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    componentFactoryResolver = fixture.debugElement.injector.get(ComponentFactoryResolver);
    fixture.detectChanges();
  });

  //create component
  it('should create the class area', () => {
    expect(component).toBeTruthy();
  });

  //check buttons
  it('should create a new button', async(() => {
    const new_button = fixture.debugElement.nativeElement;
    expect(new_button.querySelector('.new').textContent).toContain('New');
  }));

  // clicking button opens dialog
  it('click new button opens dialog',async(() => {
    spyOn(component,'openDialog');
    let new_button = fixture.debugElement.nativeElement.querySelector('.new');
    new_button.click();

    fixture.whenStable().then(() => {
      expect(component.openDialog).toHaveBeenCalled();
    });
  }));

  it('should create an edit button', async(() => {
    const new_button = fixture.debugElement.nativeElement;
    expect(new_button.querySelector('.edit').textContent).toContain('Edit');
  }));

  it('click edit button opens dialog',async(() => {
    spyOn(component,'openDialog');
    let new_button = fixture.debugElement.nativeElement.querySelector('.edit');
    new_button.click();

    fixture.whenStable().then(() => {
      expect(component.openDialog).toHaveBeenCalled();

    });
  }));

   it('after editing old version should not exist in the array', async(() => {
     const service: ClassStorageService = TestBed.get(ClassStorageService);
     let test: fullClass = {'name': 'apple','variables':['v1','v2','v3'],'methods':['m1()','m2()','m3()']};
     service.createNew('apple',['m1()','m2()','m3()'],['v1','v2','v3']);
     service.createNew('apple',['m1()','m2()'],['v1','v2','v3']);
     service.pruneArray();
     expect(service.findClass(test.name)).not.toEqual(test);

   }));

  it('should create an import button', async(() => {
    const new_button = fixture.debugElement.nativeElement;
    expect(new_button.querySelector('.import').textContent).toContain('Import');
  }));

  it('click import button opens dialog',async(() => {
    spyOn(component,'openDialog');
    let new_button = fixture.debugElement.nativeElement.querySelector('.import');
    new_button.click();

    fixture.whenStable().then(() => {
      expect(component.openDialog).toHaveBeenCalled();
    });
  }));

  it('should create an export button', async(() => {
    const new_button = fixture.debugElement.nativeElement;
    expect(new_button.querySelector('.export').textContent).toContain('Export');
  }));

  it('click export button opens dialog',async(() => {
    spyOn(component,'openDialog');
    let new_button = fixture.debugElement.nativeElement.querySelector('.export');
    new_button.click();

    fixture.whenStable().then(() => {
      expect(component.openDialog).toHaveBeenCalled();
    });

  }));

  it('should create the class',() => {    
    const service: ClassStorageService = TestBed.get(ClassStorageService);
    service.createNew("cherry",["m1()","m2()","m3()"],["v1","v2","v3"]);
    component.createClass();
    expect(ClassBoxComponent).toBeTruthy();
  });

  //test the connector
   it('should draw the line',() => {
     const el = fixture.debugElement.nativeElement;
     el.querySelector('.lineDraw').click();

     fixture.whenStable().then(() => {
       expect(component.drawSomeLines).toHaveBeenCalled();
     });
   });

  

  
});
