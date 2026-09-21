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
    service.getAll().subscribe(students => {
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

  it('should create a student', () => {
    const student = {
      firstName: 'Ada',
      lastName: 'Lovelace'
    };

    service.create(student).subscribe(response => {
      expect(response.id).toBe(1);
    });

    const request = http.expectOne('/api/students');

    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual(student);

    request.flush({
      id: 1,
      ...student
    });
  });

  it('should update a student', () => {
    const student = {
      firstName: 'Augusta Ada',
      lastName: 'Lovelace'
    };

    service.update(1, student).subscribe();

    const request = http.expectOne('/api/students/1');

    expect(request.request.method).toBe('PUT');
    expect(request.request.body).toEqual(student);

    request.flush({
      id: 1,
      ...student
    });
  });

  it('should delete a student', () => {
    service.delete(1).subscribe();

    const request = http.expectOne('/api/students/1');

    expect(request.request.method).toBe('DELETE');

    request.flush(null);
  });
});
