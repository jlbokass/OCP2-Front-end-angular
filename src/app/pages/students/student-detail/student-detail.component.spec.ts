import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  ActivatedRoute,
  Router,
  provideRouter
} from '@angular/router';
import { of, throwError } from 'rxjs';

import { StudentDetailComponent } from './student-detail.component';
import { StudentService } from '../../../core/service/student.service';

describe('StudentDetailComponent', () => {
  let component: StudentDetailComponent;
  let fixture: ComponentFixture<StudentDetailComponent>;
  let router: Router;

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

    router = TestBed.inject(Router);
    jest.spyOn(router, 'navigate')
      .mockResolvedValue(true);
  });

  function createComponent(): void {
    fixture = TestBed.createComponent(StudentDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  it('should load the student detail', () => {
    // GIVEN / WHEN: the detail route is initialized.
    createComponent();

    // THEN: student 1 is requested and exposed.
    expect(studentServiceMock.getById)
      .toHaveBeenCalledWith(1);

    expect(component.student).toEqual({
      id: 1,
      firstName: 'Ada',
      lastName: 'Lovelace'
    });

    expect(component.loading).toBe(false);
  });

  it('should expose an error when the student cannot be loaded', () => {
    // GIVEN: the detail API fails.
    studentServiceMock.getById.mockReturnValue(
      throwError(() => new Error('not found'))
    );

    // WHEN: the component initializes.
    createComponent();

    // THEN: a not-found message is exposed.
    expect(component.student).toBeNull();
    expect(component.errorMessage)
      .toBe('Étudiant introuvable.');
    expect(component.loading).toBe(false);
  });

  it('should not delete when confirmation is cancelled', () => {
    // GIVEN: a loaded student and a cancelled browser confirmation.
    createComponent();
    jest.spyOn(window, 'confirm').mockReturnValue(false);

    // WHEN: deletion is requested.
    component.deleteStudent();

    // THEN: no DELETE request is sent.
    expect(studentServiceMock.delete)
      .not.toHaveBeenCalled();
  });

  it('should delete a confirmed student and return to the list', () => {
    // GIVEN: a loaded student and a confirmed browser dialog.
    createComponent();
    jest.spyOn(window, 'confirm').mockReturnValue(true);

    // WHEN: deletion is requested.
    component.deleteStudent();

    // THEN: the service deletes the student and list navigation follows.
    expect(studentServiceMock.delete)
      .toHaveBeenCalledWith(1);

    expect(router.navigate)
      .toHaveBeenCalledWith(['/students']);
  });

  it('should expose an error when deletion fails', () => {
    // GIVEN: deletion is confirmed but the API fails.
    createComponent();
    jest.spyOn(window, 'confirm').mockReturnValue(true);

    studentServiceMock.delete.mockReturnValue(
      throwError(() => new Error('delete failed'))
    );

    // WHEN: deletion is requested.
    component.deleteStudent();

    // THEN: the failure is exposed to the user.
    expect(component.errorMessage)
      .toBe('Impossible de supprimer cet étudiant.');
  });

  it('should ignore deletion when no student is loaded', () => {
    // GIVEN: no current student.
    createComponent();
    component.student = null;

    // WHEN: deletion is requested.
    component.deleteStudent();

    // THEN: no service call is attempted.
    expect(studentServiceMock.delete)
      .not.toHaveBeenCalled();
  });
});
