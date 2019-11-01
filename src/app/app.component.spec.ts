import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { ClassAreaComponent } from './class-area/class-area.component';
import { MatDialogModule, MatSelectModule, MatToolbarModule, MatMenuModule, MatCardModule, MatIconModule } from '@angular/material';
import { ClassBoxComponent } from './class-box/class-box.component';
import { FormsModule } from '@angular/forms';

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        MatDialogModule,
        MatSelectModule,
        MatToolbarModule,
        MatMenuModule,
        MatCardModule,
        MatIconModule,
        FormsModule
      ],
      declarations: [
        AppComponent,
        ClassAreaComponent,
        ClassBoxComponent,
      ],
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'gwca'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('gwca');
  });
});
