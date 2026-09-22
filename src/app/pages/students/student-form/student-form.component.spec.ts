import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  ActivatedRoute,
  Router,
  provideRouter
} from '@angular/router';
import { of, throwError } from 'rxjs';

import { StudentFormComponent } from './student-form.component';
import { StudentService } from '../../../core/service/student.service';

describe('StudentFormComponent', () => {
  let router: Router;
  let fixture: ComponentFixture<StudentFormComponent>;
  let component: StudentFormComponent;

  const studentServiceMock = {
    getById: jest.fn(),
    create: jest.fn(),
    update: jest.fn()
  };

  const activatedRouteMock = {
    snapshot: {
      paramMap: {
        get: jest.fn()
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

    studentServiceMock.create.mockReturnValue(
      of({
        id: 1,
        firstName: 'Ada',
        lastName: 'Lovelace'
      })
    );

    studentServiceMock.update.mockReturnValue(
      of({
        id: 1,
        firstName: 'Augusta Ada',
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

    router = TestBed.inject(Router);
    jest.spyOn(router, 'navigate')
      .mockResolvedValue(true);
  });

  function createComponent(routeId: string | null = null): void {
    activatedRouteMock.snapshot.paramMap.get
      .mockReturnValue(routeId);

    fixture = TestBed.createComponent(StudentFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  it('should initialize in creation mode without an id', () => {
    // GIVEN / WHEN: the route has no student id.
    createComponent();

    // THEN: the form is ready for creation.
    expect(component.editing).toBe(false);
    expect(component.studentId).toBeNull();
  });

  it('should not call the API when the form is invalid', () => {
    // GIVEN: an empty creation form.
    createComponent();

    // WHEN: submission is attempted.
    component.onSubmit();

    // THEN: no create/update request is made.
    expect(studentServiceMock.create)
      .not.toHaveBeenCalled();
    expect(studentServiceMock.update)
      .not.toHaveBeenCalled();
  });

  it('should create a student and navigate to its detail', () => {
    // GIVEN: valid creation values.
    createComponent();

    component.studentForm.setValue({
      firstName: 'Ada',
      lastName: 'Lovelace'
    });

    // WHEN: the form is submitted.
    component.onSubmit();

    // THEN: creation is called and detail is displayed.
    expect(studentServiceMock.create)
      .toHaveBeenCalledWith({
        firstName: 'Ada',
        lastName: 'Lovelace'
      });

    expect(router.navigate)
      .toHaveBeenCalledWith(['/students', 1]);
  });

  it('should load the student when editing', () => {
    // GIVEN / WHEN: route id 1 opens the form.
    createComponent('1');

    // THEN: edit mode loads and patches the existing student.
    expect(component.editing).toBe(true);
    expect(component.studentId).toBe(1);
    expect(studentServiceMock.getById)
      .toHaveBeenCalledWith(1);

    expect(component.studentForm.value).toEqual({
      firstName: 'Ada',
      lastName: 'Lovelace'
    });
  });

  it('should update an existing student', () => {
    // GIVEN: an edit route with replacement values.
    createComponent('1');

    component.studentForm.setValue({
      firstName: 'Augusta Ada',
      lastName: 'Lovelace'
    });

    // WHEN: the edit form is submitted.
    component.onSubmit();

    // THEN: update is called and detail is displayed.
    expect(studentServiceMock.update)
      .toHaveBeenCalledWith(
        1,
        {
          firstName: 'Augusta Ada',
          lastName: 'Lovelace'
        }
      );

    expect(router.navigate)
      .toHaveBeenCalledWith(['/students', 1]);
  });

  it('should expose an error when the student cannot be loaded', () => {
    // GIVEN: loading the edit target fails.
    studentServiceMock.getById.mockReturnValue(
      throwError(() => new Error('not found'))
    );

    // WHEN: the edit route is initialized.
    createComponent('1');

    // THEN: the component exposes the loading error.
    expect(component.errorMessage)
      .toBe('Impossible de charger cet étudiant.');
  });

  it('should expose an error when saving fails', () => {
    // GIVEN: a valid form but a failing create request.
    studentServiceMock.create.mockReturnValue(
      throwError(() => new Error('save failed'))
    );

    createComponent();

    component.studentForm.setValue({
      firstName: 'Ada',
      lastName: 'Lovelace'
    });

    // WHEN: submission fails.
    component.onSubmit();

    // THEN: a user-facing save error is exposed.
    expect(component.errorMessage)
      .toBe('Impossible d’enregistrer l’étudiant.');
  });

  it('should navigate back to the list when cancelled', () => {
    // GIVEN: any form state.
    createComponent();

    // WHEN: cancellation is requested.
    component.cancel();

    // THEN: the list route is restored.
    expect(router.navigate)
      .toHaveBeenCalledWith(['/students']);
  });
});
