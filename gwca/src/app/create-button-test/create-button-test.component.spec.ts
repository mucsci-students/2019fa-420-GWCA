import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateButtonTestComponent } from './create-button-test.component';

describe('CreateButtonTestComponent', () => {
  let component: CreateButtonTestComponent;
  let fixture: ComponentFixture<CreateButtonTestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateButtonTestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateButtonTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
