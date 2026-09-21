import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  ActivatedRoute,
  provideRouter
} from '@angular/router';
import { of } from 'rxjs';

import { StudentFormComponent } from './student-form.component';
import { StudentService } from '../../../core/service/student.service';

describe('StudentFormComponent', () => {
  let component: StudentFormComponent;
  let fixture: ComponentFixture<StudentFormComponent>;

  const studentServiceMock = {
    getById: jest.fn(),
    create: jest.fn(),
    update: jest.fn()
  };

  const activatedRouteMock = {
    snapshot: {
      paramMap: {
        get: jest.fn().mockReturnValue(null)
      }
    }
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    studentServiceMock.getById.mockReturnValue(
      of({
        id: 1,
        firstName: 'Ada',
        lastName: 'Lovelace'
      })
    );

    await TestBed.configureTestingModule({
      imports: [StudentFormComponent],
      providers: [
        provideRouter([]),
        {
          provide: StudentService,
          useValue: studentServiceMock
        },
        {
          provide: ActivatedRoute,
          useValue: activatedRouteMock
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(StudentFormComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
