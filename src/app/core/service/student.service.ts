import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { StudentRequest } from '../models/StudentRequest';
import { StudentResponse } from '../models/StudentResponse';

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  private readonly apiUrl = '/api/students';

  constructor(private httpClient: HttpClient) {}

  create(student: StudentRequest): Observable<StudentResponse> {
    return this.httpClient.post<StudentResponse>(
      this.apiUrl,
      student
    );
  }

  getAll(): Observable<StudentResponse[]> {
    return this.httpClient.get<StudentResponse[]>(
      this.apiUrl
    );
  }

  getById(id: number): Observable<StudentResponse> {
    return this.httpClient.get<StudentResponse>(
      `${this.apiUrl}/${id}`
    );
  }

  update(
    id: number,
    student: StudentRequest
  ): Observable<StudentResponse> {
    return this.httpClient.put<StudentResponse>(
      `${this.apiUrl}/${id}`,
      student
    );
  }

  delete(id: number): Observable<void> {
    return this.httpClient.delete<void>(
      `${this.apiUrl}/${id}`
    );
  }
}
