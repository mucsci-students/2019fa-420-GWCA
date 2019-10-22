import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ClassAreaComponent } from './class-area.component';
import { MatDialogModule, MatSelectModule, MatDialogRef } from '@angular/material';
import { ClassStorageService, fullClass } from '../class-storage.service';
import { ClassBoxComponent } from '../class-box/class-box.component';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { ComponentFactoryResolver, DebugElement } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { Router} from '@angular/router';
import { Location } from '@angular/common';
import { CliComponent } from '../cli/cli.component';
import { routes } from '../app-routing.module';

describe('ClassAreaComponent', () => {
  let component: ClassAreaComponent;
  let fixture: ComponentFixture<ClassAreaComponent>;
  let componentFactoryResolver: ComponentFactoryResolver;
  let router: Router;
  let location: Location;
  let service: ClassStorageService;
  let test: fullClass = {'name': 'apple','variables':['v1','v2','v3'],'methods':['m1()','m2()','m3()'],'connections':[]};

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ 
        ClassAreaComponent,
        ClassBoxComponent,
        CliComponent
    ],
      imports: [
        MatDialogModule,
        MatSelectModule,
        MatDialogModule,
        RouterTestingModule.withRoutes(routes),
      ],
      providers: [{provide: MatDialogRef,ClassStorageService, useValue: {}},],
    }).compileComponents();

    TestBed.overrideModule(BrowserDynamicTestingModule, {
      set: {
        entryComponents: [ClassBoxComponent]}});

    TestBed.compileComponents();
    location = TestBed.get(Location);
    router = TestBed.get(Router);
    service = TestBed.get(ClassStorageService);
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
    service.createNew("cherry",["m1()","m2()","m3()"],["v1","v2","v3"]);
    component.createClass();
    expect(ClassBoxComponent).toBeTruthy();
  });

  //test router
  it('should load GUI',fakeAsync(() => {
    router.navigate(['']);
    tick();
    expect(location.path()).toBe('/');
  }));

  it('should load GUI even when passing random routes',fakeAsync(() => {
    router.navigate(['this_is_a_test']);
    tick();
    expect(location.path()).toBe('/');
  }));

    //jsplumb tests
    // it('should create the 4 endpoints',async(() => {
    //   service.createNew(test.name,test.methods,test.variables);
    //   component.createClass();

    //   fixture.whenStable().then(() => {
    //     const endpoints = fixture.debugElement.nativeElement.querySelectorAll('svg');
    //     expect(endpoints.length).toEqual(4);
    //   });
          
    // }));

  //CLI button tests
  it('should created the CLI link button',async(() => {
    const cli_button = fixture.debugElement.nativeElement.querySelector('.cli-button');
    expect(cli_button).toBeTruthy();
  }));

  it('clicking CLI button should link to CLI component', fakeAsync(() => {
    const cli_button = fixture.debugElement.nativeElement.querySelector('.cli-button');
    cli_button.click();
    tick();

    fixture.whenStable().then(() => {
      expect(location.path()).toBe('/cli');
    });
  }));

  it('should load CLI',fakeAsync(() => {
    router.navigate(['cli']);
    tick();
    expect(location.path()).toBe('/cli');
  }));

  

  
});
