import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';

import { StudentListComponent } from './student-list.component';
import { StudentService } from '../../../core/service/student.service';

describe('StudentListComponent', () => {
  let component: StudentListComponent;
  let fixture: ComponentFixture<StudentListComponent>;

  const studentServiceMock = {
    getAll: jest.fn()
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    studentServiceMock.getAll.mockReturnValue(
      of([
        {
          id: 1,
          firstName: 'Ada',
          lastName: 'Lovelace'
        }
      ])
    );

    await TestBed.configureTestingModule({
      imports: [StudentListComponent],
      providers: [
        {
          provide: StudentService,
          useValue: studentServiceMock
        },
        provideRouter([])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(StudentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should load students on initialization', () => {
    // THEN: the API list is exposed by the component.
    expect(studentServiceMock.getAll).toHaveBeenCalled();
    expect(component.students).toEqual([
      {
        id: 1,
        firstName: 'Ada',
        lastName: 'Lovelace'
      }
    ]);
    expect(component.loading).toBe(false);
    expect(component.errorMessage).toBeNull();
  });

  it('should support an empty student list', () => {
    // GIVEN: the backend returns no students.
    studentServiceMock.getAll.mockReturnValue(of([]));

    // WHEN: the list is refreshed.
    component.loadStudents();
    fixture.detectChanges();

    // THEN: the component exposes an empty list.
    expect(component.students).toEqual([]);
    expect(component.loading).toBe(false);
    expect(
      fixture.nativeElement.textContent
    ).toContain('Aucun étudiant enregistré.');
  });

  it('should expose a message when loading fails', () => {
    // GIVEN: the backend request fails.
    studentServiceMock.getAll.mockReturnValue(
      throwError(() => new Error('network'))
    );

    // WHEN: the list is refreshed.
    component.loadStudents();

    // THEN: loading finishes and a user-facing error is set.
    expect(component.loading).toBe(false);
    expect(component.errorMessage)
      .toBe('Impossible de charger les étudiants.');
  });
});
