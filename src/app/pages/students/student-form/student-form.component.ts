import { CommonModule } from '@angular/common';
import {
  Component,
  DestroyRef,
  inject,
  OnInit
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import {
  ActivatedRoute,
  Router
} from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';

import { MaterialModule } from '../../../shared/material.module';
import { StudentService } from '../../../core/service/student.service';
import { StudentRequest } from '../../../core/models/StudentRequest';

@Component({
  selector: 'app-student-form',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule
  ],
  templateUrl: './student-form.component.html',
  styleUrl: './student-form.component.css'
})
export class StudentFormComponent implements OnInit {

  private readonly studentService = inject(StudentService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  studentForm: FormGroup = new FormGroup({});

  studentId: number | null = null;
  editing = false;

  submitted = false;
  loading = false;
  errorMessage: string | null = null;

  ngOnInit(): void {
    this.studentForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required]
    });

    const id = this.route.snapshot.paramMap.get('id');

    if (id !== null) {
      this.studentId = Number(id);
      this.editing = true;

      this.loadStudent();
    }
  }

  get form() {
    return this.studentForm.controls;
  }

  private loadStudent(): void {
    if (this.studentId === null) {
      return;
    }

    this.loading = true;

    this.studentService.getById(this.studentId)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.loading = false)
      )
      .subscribe({
        next: student => {
          this.studentForm.patchValue({
            firstName: student.firstName,
            lastName: student.lastName
          });
        },
        error: () => {
          this.errorMessage =
            'Impossible de charger cet étudiant.';
        }
      });
  }

  onSubmit(): void {
    this.submitted = true;
    this.errorMessage = null;

    if (this.studentForm.invalid) {
      return;
    }

    const student: StudentRequest = {
      firstName: this.form['firstName'].value,
      lastName: this.form['lastName'].value
    };

    this.loading = true;

    const request$ =
      this.editing && this.studentId !== null
        ? this.studentService.update(this.studentId, student)
        : this.studentService.create(student);

    request$
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.loading = false)
      )
      .subscribe({
        next: savedStudent => {
          this.router.navigate([
            '/students',
            savedStudent.id
          ]);
        },
        error: () => {
          this.errorMessage =
            'Impossible d’enregistrer l’étudiant.';
        }
      });
  }

  cancel(): void {
    this.router.navigate(['/students']);
  }
}
