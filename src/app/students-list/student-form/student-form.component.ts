import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import {
  MatDialogRef,
  MAT_DIALOG_DATA
} from '@angular/material/dialog';
import { ApiService } from 'src/app/services/api.service';
import { catchError } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-student-form',
  templateUrl: './student-form.component.html',
  styleUrls: ['./student-form.component.scss']
})
export class StudentFormComponent implements OnInit {

  formHeading = 'Add Student';
  studentId = 0;
  formOpened = false;

  teachers = []
  genderList = []

  studentForm = new FormGroup({
    teacher_id: new FormControl('', [Validators.required]),
    name: new FormControl('', [Validators.required]),
    age: new FormControl('', [Validators.required]),
    gender: new FormControl('', [Validators.required]),
  });

  constructor(
    public dialogRef: MatDialogRef<StudentFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private fb: FormBuilder,
    private http: HttpClient,
    private apiService: ApiService,
    private snackBar: MatSnackBar,
  ) {
    this.getTeachers();
    this.getGender();
  }

  ngOnInit() {
    if (this.data.id !== 0) {
      this.edit()
    } else {
      this.resetData()
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  resetData() {

  }

  get name() {
    return this.studentForm.get('name');
  }
  get age() {
    return this.studentForm.get('age');
  }
  get gender() {
    return this.studentForm.get('gender');
  }
  get teacher_id() {
    return this.studentForm.get('teacher_id');
  }

  getTeachers() {
    this.http
      .get(`${this.apiService.baseUrl}teachers`, {
        headers: new HttpHeaders({
          Accept: 'application/json',
        }),
      })
      .pipe(catchError(this.apiService.handleError('getTeachers', [])))
      .subscribe((response: any) => {
        if (response.hasOwnProperty('data')) {
          this.teachers = response.data;
        }
      });
  }

  getGender() {
    this.http
      .get(`${this.apiService.baseUrl}genderList`, {
        headers: new HttpHeaders({
          Accept: 'application/json'
        }),
      })
      .pipe(catchError(this.apiService.handleError('getGender', [])))
      .subscribe((response: any) => {
        if (response.hasOwnProperty('data')) {
          this.genderList = response.data;
        }
      });
  }

  showServerErrors(response) {
    if (response.error.messages.hasOwnProperty('name')) {
      this.name.setErrors({
        invalid: true,
        dirty: true,
        serError: true,
        errMessages: response.error.messages.name,
      });
      this.name.markAsDirty();
    }
    if (response.error.messages.hasOwnProperty('age')) {
      this.age.setErrors({
        invalid: true,
        dirty: true,
        serError: true,
        errMessages: response.error.messages.age,
      });
      this.age.markAsDirty();
    }
    if (response.error.messages.hasOwnProperty('gender')) {
      this.gender.setErrors({
        invalid: true,
        dirty: true,
        serError: true,
        errMessages: response.error.messages.gender,
      });
      this.gender.markAsDirty();
    }

  }

  saveForm() {
    if (this.studentId === 0) {
      this.storeStudent();
    } else {
      this.updateStudent();
    }
  }

  storeStudent() {
    if (this.studentForm.valid) {
      this.http
        .post(
          `${this.apiService.baseUrl}student`,
          this.studentForm.value,
          {
            headers: new HttpHeaders({
              Accept: 'application/json',
            }),
          }
        )
        .pipe(catchError(this.apiService.handleError('storeStudent', [])))
        .subscribe(
          (response) => {
            if (response.hasOwnProperty('error')) {
              const error: any = response;

              if (error.status === 422) {
                this.showServerErrors(error);
              }
            } else {
              this.snackBar.open('Student Added', 'x', {
                duration: 5000,
              });
              this.onNoClick();
            }
          }
        );
    }
  }

  edit() {
    this.studentForm.patchValue({
      name: this.data.name,
      age: this.data.age,
      gender: this.data.gender,
      teacher_id: this.data.teacherID,
    })
    this.studentId = this.data.id;
    this.formOpened = true;
    this.formHeading = 'Edit Student';
  }

  updateStudent() {
    if (this.studentForm.valid) {
      this.http
        .patch(
          `${this.apiService.baseUrl}student/${this.studentId}`,
          this.studentForm.value,
          {
            headers: new HttpHeaders({
              Accept: 'application/json',
            }),
          }
        )
        .pipe(catchError(this.apiService.handleError('updateStudent', [])))
        .subscribe(
          (response: any) => {
            if (response.hasOwnProperty('error')) {
              const error = response;

              if (error.status === 422) {
                this.showServerErrors(error);
              }
            } else {
              this.snackBar.open('Student Updated', 'x', {
                duration: 5000,
              });
              this.onNoClick();
            }
          }
        );
    }
  }

}
