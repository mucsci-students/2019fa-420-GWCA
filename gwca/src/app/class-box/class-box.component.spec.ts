import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassBoxComponent } from './class-box.component';

describe('ClassBoxComponent', () => {
  let component: ClassBoxComponent;
  let fixture: ComponentFixture<ClassBoxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClassBoxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClassBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
