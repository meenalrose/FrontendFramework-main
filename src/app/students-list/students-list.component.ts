import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError } from 'rxjs/operators';
import { DeleteConfirmationComponent } from '../delete-confirmation/delete-confirmation.component';
import { ApiService } from '../services/api.service';
import { StudentFormComponent } from './student-form/student-form.component';

@Component({
  selector: 'app-students-list',
  templateUrl: './students-list.component.html',
  styleUrls: ['./students-list.component.scss']
})
export class StudentsListComponent implements OnInit {

  studentsList = []

  constructor(
    public dialog: MatDialog,
    private http: HttpClient,
    private apiService: ApiService,
    private snackBar: MatSnackBar,
  ) { }

  ngOnInit() {
    this.getStudentList();
  }

  getStudentList() {
    this.http
      .get(`${this.apiService.baseUrl}studentsList`, {
        headers: new HttpHeaders({
          Accept: 'application/json',
        }),
      })
      .pipe(catchError(this.apiService.handleError('getStudentList', [])))
      .subscribe((response: any) => {
        if (response.hasOwnProperty('data')) {
          this.studentsList = response.data;
        }
      });
  }

  addNewStudent(): void {
    const dialogRef = this.dialog.open(StudentFormComponent, {
      width: '70%',
      data: { id: 0 }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getStudentList();
    });
  }

  editStudent(listData): void {
    const dialogRef = this.dialog.open(StudentFormComponent, {
      width: '70%',
      data: listData
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getStudentList();
    });
  }

  deleteStudent(data): void {
    const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
      width: '300px',
      data: { id: data.id, name: data.name }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.http
          .delete(`${this.apiService.baseUrl}student/${data.id}`, {
            headers: new HttpHeaders({
              Accept: 'application/json',
            })
          })
          .pipe(catchError(this.apiService.handleError('deleteStudent', [])))
          .subscribe(
            (response: any) => {
              if (response.hasOwnProperty('error')) {
                const error = response;

                let errorMessage = `Can not delete ${data.name}! `;
                if (error.hasOwnProperty('error')) {
                  if (error.error.hasOwnProperty('message')) {
                    errorMessage += error.error.message;
                  }
                }
                this.snackBar.open(errorMessage, 'x', {
                  duration: 5000
                });
              } else {
                this.snackBar.open(`${data.name} Deleted`, 'x', {
                  duration: 5000
                });
                this.getStudentList();
              }
            }
          );
      }
    });
  }

}
