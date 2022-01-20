import { Injectable } from '@angular/core';
import { Observable, of, throwError, TimeoutError } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TokenService } from './token.service';
import { HttpClient } from '@angular/common/http';

import { catchError, timeout } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
    providedIn: 'root',
})
export class ApiService {

    public baseUrl = 'http://localhost:8000/api/';
    public fileBaseUrl = 'http://localhost:8000/';
    public appUrl = 'http://localhost:8000/';


    public appTitle = 'MIS';

    private internetConnection: boolean = true;
    constructor(
        private router: Router,
        private dialog: MatDialog,
        private tokenService: TokenService,
        private http: HttpClient,
        private snackBar: MatSnackBar
    ) {
        // this.misApi = `${window.location.protocol}//${window.location.host}/v1/api/`;
        // this.fileBaseUrl = `${window.location.protocol}//${window.location.host}/v1/`;
        // this.appUrl = window.location.host;

        window.addEventListener('offline', () => {
            if (this.internetConnection) {
                this.snackBar.open('Not connected, Please check your internet connection', null, {
                    duration: 0,
                    verticalPosition: 'bottom'
                });

                this.internetConnection = false;
            }
        });

        setInterval(() => {
            if (!this.internetConnection) {
                this.checkInternetConnection();
            }
        }, 5000);
    }

    checkInternetConnection() { }

    /**
     * Handle Http operation that failed.
     * Let the app continue.
     * @param operation - name of the operation that failed
     * @param result - optional value to return as the observable result
     */
    handleError<T>(operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {

            if (Math.floor(error.status) === 401) {
                console.log('401 Unauthenticated', operation);

                this.dialog.closeAll();
                window.location.replace('/login');
            }

            if (Math.floor(error.status) === 403) {
                console.log('403 Unauthorized', operation);

                this.dialog.closeAll();
                window.location.replace('/');
            }

            result = error;
            return of(result as T);
        };
    }
}
