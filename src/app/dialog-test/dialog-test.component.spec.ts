import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DialogTestComponent } from './dialog-test.component';
import { MatSelectModule, MatDialogModule, MatChipsModule, MatCardModule } from '@angular/material';
import { FormsModule } from '@angular/forms';
import { ClassStorageService, fullClass } from '../class-storage.service';
import { jsPlumb } from 'jsplumb';

describe('DialogTestComponent', () => {
  let component: DialogTestComponent;
  let fixture: ComponentFixture<DialogTestComponent>;
  let service: ClassStorageService;
  let empty_variables:fullClass = {'name': 'apple','variables':undefined,'methods':['m1()','m2()','m3()'],'connections':[],'position':[]};
  let empty_methods:fullClass = {'name': 'apple','variables':['v1','v2','v3'],'methods':undefined,'connections':[],'position':[]};
  let test = {'name': 'apple','variables':'v1,v2,v3','methods':'m1(),m2(),m3()','connections':[],'position':[]};



  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogTestComponent ],
      imports: [
        MatSelectModule,
        FormsModule,
        MatDialogModule,
        MatChipsModule,
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    service = TestBed.get(ClassStorageService);
    component.name = test['name'];
    component.variables = test['variables'];
    component.methods = test['methods'];

  });

  it('should replace undefined methods',async(() => {
    component.className = empty_methods['name'];
    component.variables = '1,2,3';
    component.methods = undefined;
    component.insertData();
    expect(component.methods).not.toBe(undefined);
  }));

  it('should replace undefined variables',async(() => {
    component.className = empty_variables['name'],
    component.variables = undefined;
    component.methods = '1,2,3';
    component.insertData();
    expect(component.variables).not.toBe(undefined);
  }));

  it('exists should be false before creation',() => {
    component.className = 'a';
    component.existenceCheck();
    expect(component.exists).toEqual(false);
  });



  it('should call reinitializeConnections',() => {
    spyOn(service,'reinitializeConnections');
    component.updateClass();
    expect(service.reinitializeConnections).toHaveBeenCalled();
  });

  //wrapper button tests
  it('should call insertData',() => {
    spyOn(component,'insertData');
    component.addButton();
    expect(component.insertData).toHaveBeenCalled();
  });

  it('should call updateClass',() => {
    spyOn(component,'updateClass');
    component.editButton();
    expect(component.updateClass).toHaveBeenCalled();
  });

  it('should call importDiagram',() => {
    spyOn(component,'importDiagram');
    component.importButton();
    expect(component.importDiagram).toHaveBeenCalled();
  });




 

});
