import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassBoxComponent } from './class-box.component';
import { ClassStorageService, fullClass} from '../class-storage.service';
import { MatDialogModule, MatCardModule, MatIconModule, MatChipsModule } from '@angular/material';
import { FormsModule } from '@angular/forms';
import { GuiStorageService } from '../gui-storage.service';

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
        MatCardModule,
        MatIconModule,
        FormsModule,
        MatChipsModule,
      ],
      providers: [ClassStorageService,GuiStorageService]
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

  beforeEach(async() => {
    service = TestBed.get(ClassStorageService);
    fixture = TestBed.createComponent(ClassBoxComponent);
    //initialize data
    component = fixture.componentInstance;
    component.name = test['name'];
    component.variables = test['variables'];
    component.methods = test['methods'];
    component.id = component.name + '_1';
  });

  it('shoud return the methods',async() => {
    var methods = component.trackMethods();
    expect(methods).toEqual(test['methods']);
  });

  it('should return the variables',async() => {
    var variables = component.trackVariables();
    expect(variables).toEqual(test['variables']);
  });

  it('should update the methods',async() => {
    service.createNew(test['name'],test['variables'],['m1()','m2()']);
    component.updateValues();
    expect(component.methods).not.toEqual(test['methods']);
  });

  it('should update the variables',async() => {
    service.createNew(test['name'],['v1','v2'],test['methods']);
    component.updateValues();
    expect(component.variables).not.toEqual(test['variables']);
  });

  it('should call updateValues',async() => {
    spyOn(component,'updateValues')
    service.createNew(test['name'],test['methods'],test['variables']);
    component.ngDoCheck();
    expect(component.updateValues).toHaveBeenCalled();
  });

  it('should update the variables on edit finishing',async() => {
    service.createNew(test['name'],['v1','v2'],test['methods']);
    component.ngDoCheck();
    expect(component.variables).not.toEqual(test['variables']);
  });

  it('should update the methods on edit finishing',async() => {
    service.createNew(test['name'],test['variables'],['m1()','m2()']);
    component.ngDoCheck();
    expect(component.methods).not.toEqual(test['methods']);
  });

  //chip removal
  it('should remove a method',async() => {
    service.createNew('apple',['m1()','m2()','m3()'],['v1','v2','v3']);
    component.methods = ['m1()','m2()','m3()'];
    component.removeMethod('m2()');
    expect(component.methods).toEqual(['m1()','m3()']);
  });



  it('should remove a variable',async() => {
    service.createNew('apple',['m1()','m2()','m3()'],['v1','v2','v3']);
    component.variables = ['v1','v2','v3'];
    component.removeVariable('v3');
    expect(component.variables).toEqual(['v1','v2']);
  });



  it('should set the editor variable to name',async() => {
    component.openEditor('name','apple');
    expect(component.edit).toBe('name');
  });

  it('should call pull name inside open editor',async() => {
    spyOn(component,'pullName');
    component.openEditor('name','apple');
    expect(component.pullName).toHaveBeenCalled();
  });

  //name editor
  it('should set the edit to name',async() => {
    component.pullName();
    expect(component.edit).toEqual('name');
  });

  it('should set the editorName to be the name',async()=> {
    component.pullName();
    expect(component.name).toBe('apple');
  });


  it('should update the variable chip',()=> {
    service.createNew('apple',['m1()','m2()','m3()'],['v1','v2','v3']);
    component.chipAttribute = 'v4';
    component.oldChipValue = 'v2';
    component.updateChip();

    expect(component.variables).not.toBe(['v1','v2','v3']);
  });

  it('should update the method chip',() => {
    service.createNew('apple',['m1()','m2()','m3()'],['v1','v2','v3']);
    component.chipAttribute = 'm5()';
    component.oldChipValue = 'm2()';
    component.updateChip();
    expect(component.methods).not.toBe(['m1()','m2()','m3()']);
  });

  it('should call updateValues inside updateChip',() => {
    spyOn(component,'updateValues');
    component.updateChip();
    expect(component.updateValues).toHaveBeenCalled();
  });

  it('should reset the editor variable on finishing updateChip',() => {
    service.createNew('apple',['m1()','m2()','m3()'],['v1','v2','v3']);
    component.edit = 'apple';
    component.updateChip();
    expect(component.edit).not.toBe('apple');
    expect(component.edit).toBe('');
  });

  it('should reset the old chip value on finishing updateChip',() => {
    service.createNew('apple',['m1()','m2()','m3()'],['v1','v2','v3']);
    component.oldChipValue = 'apple';
    component.updateChip();
    expect(component.oldChipValue).toBe('');
    expect(component.oldChipValue).not.toBe('apple');
  });




});
