import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting
} from '@angular/common/http/testing';

import { StudentService } from './student.service';

describe('StudentService', () => {
  let service: StudentService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        StudentService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(StudentService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    http.verify();
  });

  it('should get all students', () => {
    // GIVEN / WHEN: the list is requested.
    service.getAll().subscribe(students => {
      // THEN: the HTTP response is returned to the caller.
      expect(students.length).toBe(1);
      expect(students[0].firstName).toBe('Ada');
    });

    const request = http.expectOne('/api/students');

    expect(request.request.method).toBe('GET');

    request.flush([
      {
        id: 1,
        firstName: 'Ada',
        lastName: 'Lovelace'
      }
    ]);
  });

  it('should get one student by id', () => {
    // GIVEN / WHEN: student 1 is requested.
    service.getById(1).subscribe(student => {
      // THEN: the detail response is returned.
      expect(student).toEqual({
        id: 1,
        firstName: 'Ada',
        lastName: 'Lovelace'
      });
    });

    const request = http.expectOne('/api/students/1');

    expect(request.request.method).toBe('GET');

    request.flush({
      id: 1,
      firstName: 'Ada',
      lastName: 'Lovelace'
    });
  });

  it('should create a student', () => {
    // GIVEN: a student creation payload.
    const student = {
      firstName: 'Ada',
      lastName: 'Lovelace'
    };

    // WHEN: creation is requested.
    service.create(student).subscribe(response => {
      expect(response.id).toBe(1);
    });

    // THEN: the service POSTs the expected body.
    const request = http.expectOne('/api/students');

    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual(student);

    request.flush({
      id: 1,
      ...student
    });
  });

  it('should update a student', () => {
    // GIVEN: replacement values.
    const student = {
      firstName: 'Augusta Ada',
      lastName: 'Lovelace'
    };

    // WHEN: update is requested.
    service.update(1, student).subscribe();

    // THEN: the service PUTs the expected body.
    const request = http.expectOne('/api/students/1');

    expect(request.request.method).toBe('PUT');
    expect(request.request.body).toEqual(student);

    request.flush({
      id: 1,
      ...student
    });
  });

  it('should delete a student', () => {
    // GIVEN / WHEN: deletion of student 1 is requested.
    service.delete(1).subscribe();

    // THEN: the expected DELETE request is sent.
    const request = http.expectOne('/api/students/1');

    expect(request.request.method).toBe('DELETE');

    request.flush(null);
  });
});
