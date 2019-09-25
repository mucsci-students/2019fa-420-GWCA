import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogTestComponent } from './dialog-test.component';
import { MatSelectModule } from '@angular/material';

describe('DialogTestComponent', () => {
  let component: DialogTestComponent;
  let fixture: ComponentFixture<DialogTestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogTestComponent ],
      imports: [
        MatSelectModule,
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });



});
