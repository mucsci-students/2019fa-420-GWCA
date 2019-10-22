import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DialogTestComponent } from './dialog-test.component';
import { MatSelectModule, MatDialogModule } from '@angular/material';
import { FormsModule } from '@angular/forms';

describe('DialogTestComponent', () => {
  let component: DialogTestComponent;
  let fixture: ComponentFixture<DialogTestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogTestComponent ],
      imports: [
        MatSelectModule,
        FormsModule,
        MatDialogModule,
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should replace undefined methods',async(() => {
    component.className = 'apple';
    component.variables = '1,2,3';
    component.methods = undefined;
    component.insertData();
    expect(component.methods).not.toBe(undefined);
  }));

  it('should replace undefined variables',async(() => {
    component.className = 'apple',
    component.variables = undefined;
    component.methods = '1,2,3';
    component.insertData();
    expect(component.variables).not.toBe(undefined);
  }));
});
