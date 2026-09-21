import {
  Component,
  DestroyRef,
  inject,
  OnInit
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { StudentService } from '../../../core/service/student.service';
import { StudentResponse } from '../../../core/models/StudentResponse';

import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-student-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink
  ],
  templateUrl: './student-list.component.html',
  styleUrl: './student-list.component.css'
})
export class StudentListComponent implements OnInit {

  private readonly studentService =
    inject(StudentService);

  private readonly destroyRef =
    inject(DestroyRef);

  students: StudentResponse[] = [];

  loading = false;
  errorMessage: string | null = null;

  ngOnInit(): void {
    this.loadStudents();
  }

  loadStudents(): void {
    this.loading = true;
    this.errorMessage = null;

    this.studentService.getAll()
      .pipe(
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: students => {
          this.students = students;
          this.loading = false;
        },
        error: () => {
          this.errorMessage =
            'Impossible de charger les étudiants.';
          this.loading = false;
        }
      });
  }
}
