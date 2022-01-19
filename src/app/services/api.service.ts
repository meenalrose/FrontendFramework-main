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
    public baseUrl = 'https://alpha.botsapi.app.mapapi.io/';
    // public baseUrl = 'http://localhost:3000/';
    public misApi = 'https://alpha.panel.mapapi.io/v1/api/';
    public fileBaseUrl = 'https://alpha.panel.mapapi.io/v1/';
    public appUrl = 'https://alpha.panel.mapapi.io';


    public appTitle = 'Bots';

    private internetConnection: boolean = true;
    constructor(
        private router: Router,
        private dialog: MatDialog,
        private tokenService: TokenService,
        private http: HttpClient,
        private snackBar: MatSnackBar
    ) {
        this.misApi = `${window.location.protocol}//${window.location.host}/v1/api/`;
        this.fileBaseUrl = `${window.location.protocol}//${window.location.host}/v1/`;
        this.appUrl = window.location.host;

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

    checkInternetConnection() {
        this.http.get(`${this.misApi}countries`)
            .pipe(timeout(5000), catchError(this.handleError('checkInternetConnection', [])))
            .subscribe((response: any) => {
                if (response.status >= 200 && response.status < 304) {
                    if (!this.internetConnection) {
                        this.snackBar.open('Connection restored', 'x', {
                            duration: 5000,
                            verticalPosition: 'bottom'
                        });
                    }
                    this.internetConnection = true;
                }
            });
    }

    /**
     * Handle Http operation that failed.
     * Let the app continue.
     * @param operation - name of the operation that failed
     * @param result - optional value to return as the observable result
     */
    handleError<T>(operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {
            if (error instanceof TimeoutError) {
                if (this.internetConnection && operation !== 'getExportLogs') {
                    this.internetConnection = false;

                    this.snackBar.open('Not connected, Please check your internet connection', null, {
                        duration: 0,
                        verticalPosition: 'bottom'
                    });
                }

                return throwError('Timeout Exception');
            }

            if (error.hasOwnProperty('jwt')) {
                if (error.error.hasOwnProperty('jwt')) {
                    this.tokenService.setToken(error.error.jwt);
                }
            }

            if (Math.floor(error.status) === 401) {
                console.log('401 Unauthenticated', operation);

                this.dialog.closeAll();
                // this.tokenService.clearToken();
                // this.router.navigate(['/login']);
                window.location.replace('/login');
            }

            if (Math.floor(error.status) === 403) {
                console.log('403 Unauthorized', operation);

                this.dialog.closeAll();
                // this.tokenService.clearToken();
                // this.router.navigate(['/login']);
                window.location.replace('/');
            }

            result = error;
            return of(result as T);
        };
    }
}
