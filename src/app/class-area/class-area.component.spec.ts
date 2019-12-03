import { async, ComponentFixture, TestBed, fakeAsync, tick, ComponentFixtureNoNgZone } from '@angular/core/testing';
import { ClassAreaComponent } from './class-area.component';
import { MatDialogModule, MatSelectModule, MatDialogRef, MatChipsModule, MatToolbarModule, MatMenuModule, MatCardModule, MatIconModule } from '@angular/material';
import { ClassStorageService, fullClass } from '../class-storage.service';
import { ClassBoxComponent } from '../class-box/class-box.component';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { ComponentFactoryResolver } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { Router} from '@angular/router';
import { Location } from '@angular/common';
import { CliComponent } from '../cli/cli.component';
import { routes } from '../app-routing.module';
import { FormsModule } from '@angular/forms';
import { GuiStorageService } from '../gui-storage.service';
import { DialogTestComponent } from '../dialog-test/dialog-test.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { jsPlumb } from 'jsplumb';
import { By } from '@angular/platform-browser';

describe('ClassAreaComponent', () => {
  let component: ClassAreaComponent;
  let fixture: ComponentFixture<ClassAreaComponent>;
  let componentFactoryResolver: ComponentFactoryResolver;
  let router: Router;
  let location: Location;
  let service: ClassStorageService;
  let guiService: GuiStorageService;
  let test: fullClass = {'name': 'apple','variables':['v1','v2','v3'],'methods':['m1()','m2()','m3()'],'connections':[],'position':[]};

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ClassAreaComponent,
        ClassBoxComponent,
        CliComponent,
        DialogTestComponent
    ],
      imports: [
        MatDialogModule,
        MatSelectModule,
        MatDialogModule,
        MatChipsModule,
        MatToolbarModule,
        MatMenuModule,
        MatCardModule,
        MatIconModule,
        FormsModule,
        MatChipsModule,
        BrowserAnimationsModule,
        RouterTestingModule.withRoutes(routes),
      ],
      providers: [{provide: MatDialogRef,ClassStorageService,GuiStorageService, useValue: {}},],
    }).compileComponents();

    TestBed.overrideModule(BrowserDynamicTestingModule, {
      set: {
        entryComponents: [ClassBoxComponent,DialogTestComponent]}});

    TestBed.compileComponents();
    location = TestBed.get(Location);
    router = TestBed.get(Router);
    service = TestBed.get(ClassStorageService);
    guiService = TestBed.get(GuiStorageService);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClassAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    componentFactoryResolver = fixture.debugElement.injector.get(ComponentFactoryResolver);
    fixture.detectChanges();
  });


  //lifecycle hooks
  it('should call revert left shift in ngAfterViewInit',() => {
    spyOn(guiService,'revertLeftShift');
    component.ngAfterViewInit();
    expect(guiService.revertLeftShift).toHaveBeenCalled();
  });

  it('should not call reinitializeConnections in ngAfterViewInit',() => {
    spyOn(guiService,'reinitializeConnections');
    component.ngAfterViewInit();
    expect(guiService.reinitializeConnections).not.toHaveBeenCalled();
  });

  it('should call reintializeConnections in ngAfterViewInit',() => {
    spyOn(guiService,'reinitializeConnections');
    service.createNew(test['name'],test['methods'],test['variables']);
    component.ngAfterViewInit();
    expect(guiService.reinitializeConnections).toHaveBeenCalled();
  });

  it('should initialize classBoxes (as empty)',() => {
    component.ngOnInit();
    expect(component.classBoxes.length).toEqual(0);
  });

  it('should call updateBackend on insertion',() => {
    spyOn(component,'updateBackend');
    service.createNew(test['name'],test['methods'],test['variables']);
    component.ngDoCheck();
    expect(component.updateBackend).toHaveBeenCalled();
  });

  it('should not call create class in updateBackend if there are no classes',() => {
    spyOn(component,'createClass');
    component.updateBackend();
    expect(component.createClass).not.toHaveBeenCalled();
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

  it('should open the correct (new) dialog in openDialog',() => {
    component.openDialog('new');
    expect(component.dialogRef.componentInstance.name).toBe('New Button');
  });

  it('should create an edit button', async(() => {
    service.createNew("cherry",['none'],['none']);
    fixture.detectChanges();
    let edit_button = fixture.debugElement.nativeElement.querySelector('.edit-button');
    expect(edit_button).not.toBeNull();
  }));

  it('click edit button opens editor',async(() => {
    service.createNew("cherry",['none'],['none']);
    fixture.detectChanges();
    let edit_button = fixture.debugElement.nativeElement.querySelector('.edit-button');
    edit_button.click();
    fixture.detectChanges();
    let editor = fixture.debugElement.nativeElement.querySelector('.editor');
    expect(editor).not.toBeNull();
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

  it('should open the correct (import) dialog in openDialog',() => {
    component.openDialog('import');
    expect(component.dialogRef.componentInstance.name).toBe('Import Button');
  });

  it('should open the correct (help) dialog in openDialog',() => {
    component.openDialog('help');
    expect(component.dialogRef.componentInstance.name).toBe('Help');
  });

  it('should create an export button', async(() => {
    const new_button = fixture.debugElement.nativeElement;
    expect(new_button.querySelector('.export').textContent).toContain('Export');
  }));

  it('click export button opens dialog', async(() => {
    spyOn(component, 'openDialog');
    let export_button = fixture.debugElement.nativeElement.querySelector('.export');
    export_button.click();

    fixture.whenStable().then(() => {
      expect(component.openDialog).toHaveBeenCalled();
    });
  }));

  it ('should increase Blob size on class creation', () => {
    let export_button = fixture.debugElement.nativeElement.querySelector('.export');
    export_button.click();
    const testBlobA = component.blob;
    var size = testBlobA.size;
    service.createNew("cherry",["m1()","m2()","m3()"],["v1","v2","v3"]);
    component.createClass();
    export_button.click();
    const testBlobB = component.blob;
    expect (testBlobB.size > size).toBeTruthy();
  });

  it ('should contain a file of type YAML in the Blob', () => {
    let export_button = fixture.debugElement.nativeElement.querySelector('.export');
    export_button.click();
    const testBlob = component.blob;
    expect (testBlob.type).toMatch("application/yaml");
  });


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

  it('should update the position in the back end',() => {

    service.createNew('apple',['m1'],['v1']);
    component.createClass();
    component.updatePosition();
    expect(service.findClass('apple').position).not.toBe([]);
  });

  //jsplumb test
  it('should call revert left shift',() => {
    spyOn(guiService,'revertLeftShift');
    component.ngAfterViewInit();
    expect(guiService.revertLeftShift).toHaveBeenCalled();
  });

  it('should not call reinitialize connections in ngAfterViewInit if there are no classes',() => {
    spyOn(guiService,'reinitializeConnections');
    component.ngAfterViewInit();
    expect(guiService.reinitializeConnections).not.toHaveBeenCalled();
  });

  //test adding endpoints
  it('should add endpoints on creation of classbox',async() => {
    service.createNew("cherry",['none'],['none']);
    expect(ClassBoxComponent).toBeTruthy();
    fixture.detectChanges();
    var classbox = fixture.debugElement.nativeElement.querySelector('.jtk-endpoint');
    expect(classbox).not.toBeUndefined();
  });

  it('should store connections on switch to cli',async() => {
    //create class boxes
    spyOn(guiService,'connectionsUpdateWrapper');
    service.createNew("cherry",['none'],['none']);
    service.createNew("apple",['none'],['none']);
    var instance = jsPlumb.getInstance();

    fixture.detectChanges();

    //connect class boxes
    instance.connect({source: 'cherry_0',target: 'apple_1',anchors: ['Left','Right']});
    //var connection = instance.getAllConnections()[0];
    //set uuids (because I have to do it manually...)
    // connection.endpoints[0].uuid = 'cherry_0_left';
    // connection.endpoints[1].uuid = 'apple_1_right';

    // instance.connect({uuids: ['cherry_0_left','cherry_0_left']});
    fixture.detectChanges();
    //make sure there is a connection
    var connection = fixture.debugElement.nativeElement.querySelector('.jtk-connector');
    expect(connection).not.toBeUndefined();
    //go to cli
    var cli_button = fixture.debugElement.nativeElement.querySelector('.cli-button');
    cli_button.click();
    //getting endpoints
    expect(guiService.connectionsUpdateWrapper).toHaveBeenCalled();



  });

  it('should bind connections on class box creation',() => {
    spyOn(guiService,'bindConnections');
    service.createNew("cherry",['none'],['none']);
    fixture.detectChanges();
    expect(guiService.bindConnections).toHaveBeenCalled();
  });

  it('should not call insertConnection in connectionsUpdateWrapper if no connections are made',() => {
    spyOn(guiService,'insertConnection');
    spyOn(guiService,'updateConnections');
    //create class box so it doesn't break
    service.createNew("cherry",['none'],['none']);
    service.createNew("apple",['none'],['none']);
    fixture.detectChanges();
    guiService.connectionsUpdateWrapper();
    expect(guiService.insertConnection).not.toHaveBeenCalled();
    expect(guiService.updateConnections).toHaveBeenCalled();

  });

  it('should return null in updateConnections if no connections are made',() =>{
    service.createNew("cherry",['none'],['none']);
    fixture.detectChanges();
    var connections = guiService.updateConnections();
    expect(connections).toEqual([]);
  });

  it('should make a class box draggable on creation',() => {
    service.createNew("cherry",['none'],['none']);
    fixture.detectChanges();
    //jsplumb just adds jtk-draggable to make something draggable
    var draggable_class_box = fixture.debugElement.nativeElement.querySelector('.jtk-draggable');
    expect(draggable_class_box).not.toBeNull();
  });

  //editor testing
  it('should open an editor on edit button click in a class box',() => {
    service.createNew("cherry",['none'],['none']);
    fixture.detectChanges();
    var edit_button = fixture.debugElement.nativeElement.querySelector('.edit-button');
    edit_button.click();
    fixture.detectChanges();
    var editor = fixture.debugElement.nativeElement.querySelector('.editor');
    expect(editor).not.toBeNull();
  });

  it('should delete a class delete button click in a class box',() => {
    service.createNew("cherry",['none'],['none']);
    fixture.detectChanges();
    var edit_button = fixture.debugElement.nativeElement.querySelector('.delete-button');
    edit_button.click();
    fixture.detectChanges();
    var class_box = fixture.debugElement.nativeElement.querySelector('.class-box');
    expect(class_box).toBeNull();
  });

  it('should open an editor on click of the new button in the class box for methods',() => {
    service.createNew("cherry",['none'],['none']);
    fixture.detectChanges();
    var new_button = fixture.debugElement.nativeElement.querySelector('.add-button.method');
    new_button.click();
    fixture.detectChanges();
    var editor = fixture.debugElement.nativeElement.querySelector('.editor');
    expect(editor).not.toBeNull();
  });

  it('should open an editor on click of the new button in the class box for variables',() => {
    service.createNew("cherry",['none'],['none']);
    fixture.detectChanges();
    var new_button = fixture.debugElement.nativeElement.querySelector('.add-button.variable');
    new_button.click();
    fixture.detectChanges();
    var editor = fixture.debugElement.nativeElement.querySelector('.editor');
    expect(editor).not.toBeNull();
  });

  it ('should return to a previous save on import', () => {
    let export_button = fixture.debugElement.nativeElement.querySelector('.export');
    service.createNew('apple',['m1'],['v1']);
    component.createClass();
    export_button.click();
    const testBlob = component.blob;
    var file : Blob = testBlob.slice();
    service.removeClassByIndex(0);
    var event = {target: {files: {0: file}}};
    component.import(event);
    export_button.click();
    expect(file).toEqual(component.blob.slice());
  });


});
