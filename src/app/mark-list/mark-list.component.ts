import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError } from 'rxjs/operators';
import { DeleteConfirmationComponent } from '../delete-confirmation/delete-confirmation.component';
import { ApiService } from '../services/api.service';
import { MarksFormComponent } from './marks-form/marks-form.component';

@Component({
  selector: 'app-mark-list',
  templateUrl: './mark-list.component.html',
  styleUrls: ['./mark-list.component.scss']
})
export class MarkListComponent implements OnInit {

  marksList = []

  constructor(
    public dialog: MatDialog,
    private http: HttpClient,
    private apiService: ApiService,
    private snackBar: MatSnackBar,
  ) { }

  ngOnInit() {
    this.getMarksList();
  }

  getMarksList() {
    this.http
      .get(`${this.apiService.baseUrl}marksList`, {
        headers: new HttpHeaders({
          Accept: 'application/json',
        }),
      })
      .pipe(catchError(this.apiService.handleError('getMarksList', [])))
      .subscribe((response: any) => {
        if (response.hasOwnProperty('data')) {
          this.marksList = response.data;
        }
      });
  }

  addStudentMarks(): void {
    const dialogRef = this.dialog.open(MarksFormComponent, {
      width: '70%',
      data: { id: 0 }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getMarksList();
    });
  }

  editMark(listData): void {
    const dialogRef = this.dialog.open(MarksFormComponent, {
      width: '70%',
      data: listData
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getMarksList();
    });
  }

  deleteMark(data): void {
    const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
      width: '300px',
      data: { id: data.id, name: data.name }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.http
          .delete(`${this.apiService.baseUrl}marks/${data.id}`, {
            headers: new HttpHeaders({
              Accept: 'application/json',
            })
          })
          .pipe(catchError(this.apiService.handleError('deleteMark', [])))
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
                this.getMarksList();
              }
            }
          );
      }
    });
  }

}
