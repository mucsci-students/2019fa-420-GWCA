import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassBoxComponent } from './class-box.component';
import { ClassStorageService, fullClass} from '../class-storage.service';
import { MatDialogModule, MatCardModule } from '@angular/material';
import { ExpectedConditions } from 'protractor';

describe('ClassBoxComponent', () => {
  let component: ClassBoxComponent;
  let fixture: ComponentFixture<ClassBoxComponent>;
  let service: ClassStorageService;
  let test: fullClass = {'name': 'apple','variables':['v1','v2','v3'],'methods':['m1()','m2()','m3()'],'connections':[],'position':[]};


  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ClassBoxComponent],
      imports: [
        MatDialogModule,
        MatCardModule
      ],
      providers: [ClassStorageService]
    })
    .compileComponents()
    .then(() => {
      service = TestBed.get(ClassStorageService);
      fixture = TestBed.createComponent(ClassBoxComponent);
      //initialize data
      component = fixture.componentInstance;
      component.name = test['name'];
      component.variables = test['variables'];
      component.methods = test['methods'];
      component.id = component.name + '_1';
    });
    
  }));

  beforeEach(() => {

  });

  it('shoud return the methods',() => {
    var methods = component.trackMethods();
    expect(methods).toEqual(test['methods']);
  });

  it('should return the variables',() => {
    var variables = component.trackVariables();
    expect(variables).toEqual(test['variables']);
  });

  it('should update the methods',() => {
    service.createNew(test['name'],test['variables'],['m1()','m2()']);
    component.updateValues();
    expect(component.methods).not.toEqual(test['methods']);
  });

  it('should update the variables',() => {
    service.createNew(test['name'],['v1','v2'],test['methods']);
    component.updateValues();
    expect(component.variables).not.toEqual(test['variables']);
  });

  it('should call updateValues',() => {
    spyOn(component,'updateValues')
    service.createNew(test['name'],test['methods'],test['variables']);
    component.ngDoCheck();
    expect(component.updateValues).toHaveBeenCalled();
  });

  it('should update the variables on edit finishing',() => {
    service.createNew(test['name'],['v1','v2'],test['methods']);
    component.ngDoCheck();
    expect(component.variables).not.toEqual(test['variables']);
  });

  it('should update the methods on edit finishing',() => {
    service.createNew(test['name'],test['variables'],['m1()','m2()']);
    component.ngDoCheck();
    expect(component.methods).not.toEqual(test['methods']);
  });








});
