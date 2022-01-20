import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError } from 'rxjs/operators';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-marks-form',
  templateUrl: './marks-form.component.html',
  styleUrls: ['./marks-form.component.scss']
})
export class MarksFormComponent implements OnInit {

  formHeading = "Add Marks"
  students = [];
  terms = [];
  marksId = 0
  formOpened = false;

  marksForm = new FormGroup({
    // name: new FormControl(''),
    term: new FormControl('', [Validators.required]),
    student: new FormControl('', [Validators.required]),
    science: new FormControl('', [Validators.required]),
    maths: new FormControl('', [Validators.required]),
    history: new FormControl('', [Validators.required]),
  });

  constructor(
    public dialogRef: MatDialogRef<MarksFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private fb: FormBuilder,
    private http: HttpClient,
    private apiService: ApiService,
    private snackBar: MatSnackBar,
  ) { }

  ngOnInit() {
    if (this.data.id !== 0) {
      this.edit()
    } else {
      this.resetData()
    }
    this.getStudents();
    this.getTerm();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  get name() {
    return this.marksForm.get('name');
  }
  get term() {
    return this.marksForm.get('term');
  }
  get maths() {
    return this.marksForm.get('maths');
  }
  get science() {
    return this.marksForm.get('science');
  }
  get history() {
    return this.marksForm.get('history');
  }

  getTerm() {
    this.http
      .get(`${this.apiService.baseUrl}termList`, {
        headers: new HttpHeaders({
          Accept: 'application/json'
        }),
      })
      .pipe(catchError(this.apiService.handleError('getTerm', [])))
      .subscribe((response: any) => {
        if (response.hasOwnProperty('data')) {
          this.terms = response.data;
        }
      });
  }

  getStudents() {
    this.http
      .get(`${this.apiService.baseUrl}studentsList`, {
        headers: new HttpHeaders({
          Accept: 'application/json'
        }),
      })
      .pipe(catchError(this.apiService.handleError('getStudents', [])))
      .subscribe((response: any) => {
        if (response.hasOwnProperty('data')) {
          this.students = response.data;
        }
      });
  }

  submit() {
    if (this.marksId === 0) {
      this.storeMarks();
    } else {
      this.updateMarks();
    }
  }

  showServerErrors(response) {

  }

  resetData() {

  }

  storeMarks() {
    if (this.marksForm.valid) {
      this.http
        .post(
          `${this.apiService.baseUrl}marks`,
          this.marksForm.value,
          {
            headers: new HttpHeaders({
              Accept: 'application/json',
            }),
          }
        )
        .pipe(catchError(this.apiService.handleError('storeMarks', [])))
        .subscribe(
          (response) => {
            if (response.hasOwnProperty('error')) {
              const error: any = response;

              if (error.status === 422) {
                this.showServerErrors(error);
              }
            } else {
              this.snackBar.open('Marks Added', 'x', {
                duration: 5000,
              });
              this.onNoClick();
            }
          }
        );
    }
  }

  edit() {
    this.marksId = this.data.id;
    this.formOpened = true;
    this.formHeading = 'Edit Marks';
    this.marksForm.patchValue({
      student: this.data.studentId,
      term: this.data.term,
      science: this.data.science,
      maths: this.data.maths,
      history: this.data.history
    })
  }

  updateMarks() {
    if (this.marksForm.valid) {
      this.http
        .post(
          `${this.apiService.baseUrl}marks/${this.marksId}`,
          this.marksForm.value,
          {
            headers: new HttpHeaders({
              Accept: 'application/json',
            }),
          }
        )
        .pipe(catchError(this.apiService.handleError('updateMarks', [])))
        .subscribe(
          (response: any) => {
            if (response.hasOwnProperty('error')) {
              const error = response;

              if (error.status === 422) {
                this.showServerErrors(error);
              }
            } else {
              this.snackBar.open('Marks Updated', 'x', {
                duration: 5000,
              });
              this.onNoClick();
            }
          }
        );
    }
  }

}
