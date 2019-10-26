import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassBoxComponent } from './class-box.component';
import { ClassStorageService} from '../class-storage.service';
import { MatDialogModule } from '@angular/material';

describe('ClassBoxComponent', () => {
  let component: ClassBoxComponent;
  let fixture: ComponentFixture<ClassBoxComponent>;
  let service: ClassStorageService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ClassBoxComponent],
      imports: [
        MatDialogModule,
      ],
      providers: [ClassStorageService]
    })
    .compileComponents();
    
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClassBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });






});
