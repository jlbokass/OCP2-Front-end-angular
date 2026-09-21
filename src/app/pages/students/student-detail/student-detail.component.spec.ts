import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  ActivatedRoute,
  provideRouter
} from '@angular/router';
import { of } from 'rxjs';

import { StudentDetailComponent } from './student-detail.component';
import { StudentService } from '../../../core/service/student.service';

describe('StudentDetailComponent', () => {
  let component: StudentDetailComponent;
  let fixture: ComponentFixture<StudentDetailComponent>;

  const studentServiceMock = {
    getById: jest.fn(),
    delete: jest.fn()
  };

  const activatedRouteMock = {
    snapshot: {
      paramMap: {
        get: jest.fn().mockReturnValue('1')
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

    studentServiceMock.delete.mockReturnValue(
      of(undefined)
    );

    await TestBed.configureTestingModule({
      imports: [StudentDetailComponent],
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

    fixture = TestBed.createComponent(StudentDetailComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.student).toEqual({
      id: 1,
      firstName: 'Ada',
      lastName: 'Lovelace'
    });
  });
});
