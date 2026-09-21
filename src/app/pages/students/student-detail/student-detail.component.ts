import {
  Component,
  DestroyRef,
  inject,
  OnInit
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ActivatedRoute,
  Router,
  RouterLink
} from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { StudentService } from '../../../core/service/student.service';
import { StudentResponse } from '../../../core/models/StudentResponse';

@Component({
  selector: 'app-student-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink
  ],
  templateUrl: './student-detail.component.html',
  styleUrl: './student-detail.component.css'
})
export class StudentDetailComponent implements OnInit {

  private readonly studentService =
    inject(StudentService);

  private readonly route =
    inject(ActivatedRoute);

  private readonly router =
    inject(Router);

  private readonly destroyRef =
    inject(DestroyRef);

  student: StudentResponse | null = null;

  loading = false;
  errorMessage: string | null = null;

  ngOnInit(): void {
    const id = Number(
      this.route.snapshot.paramMap.get('id')
    );

    this.loading = true;

    this.studentService.getById(id)
      .pipe(
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: student => {
          this.student = student;
          this.loading = false;
        },
        error: () => {
          this.errorMessage =
            'Étudiant introuvable.';
          this.loading = false;
        }
      });
  }

  deleteStudent(): void {
    if (!this.student) {
      return;
    }

    if (!confirm(
      `Supprimer ${this.student.firstName} ${this.student.lastName} ?`
    )) {
      return;
    }

    this.studentService.delete(this.student.id)
      .pipe(
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: () => {
          this.router.navigate(['/students']);
        },
        error: () => {
          this.errorMessage =
            'Impossible de supprimer cet étudiant.';
        }
      });
  }
}
