import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

import { UserCredentials, FirebaseAuthResponse, UserData } from '../interfaces';
import { environment } from 'src/environments/environment';
import { AlertService } from './alert.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
    showProfile$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
        false
    );
    keyQuery = `key=${environment.firebaseApiKey}`;
    url = 'https://identitytoolkit.googleapis.com/v1/accounts';

    constructor(
        private alert: AlertService,
        private http: HttpClient,
        private router: Router
    ) {}

    get token(): string {
        const expDate = new Date(localStorage.getItem('token-exp'));
        if (new Date() > expDate) {
            this.logout();
            return null;
        }
        this.showProfile$.next(true);
        return localStorage.getItem('token');
    }

    createUser(userData: UserData): Observable<any> {
        return this.http.patch(
            `${environment.firebaseDbUrl}/users/${userData.userId}.json`,
            userData
        );
    }

    deleteAccount(): Observable<any> {
        const token = { idToken: this.token };
        return this.http
            .post(`${this.url}:delete?${this.keyQuery}`, token)
            .pipe(catchError(this.setError.bind(this)));
    }

    isAuthenticated(): boolean {
        return !!this.token;
    }

    login(credentials: UserCredentials): Observable<any> {
        credentials.returnSecureToken = true;
        return this.http
            .post(
                `${this.url}:signInWithPassword?${this.keyQuery}`,
                credentials
            )
            .pipe(tap(this.setToken), catchError(this.setError.bind(this)));
    }

    logout(): void {
        this.setToken(null);
    }

    signup(credentials: UserCredentials): Observable<any> {
        credentials.returnSecureToken = true;
        return this.http
            .post(`${this.url}:signUp?${this.keyQuery}`, credentials)
            .pipe(tap(this.setToken), catchError(this.setError.bind(this)));
    }

    updateEmailOrPassword(
        newValue: { email: string } | { password: string }
    ): Observable<any> {
        const body = {
            idToken: this.token,
            returnSecureToken: true,
            ...newValue,
        };

        return this.http
            .post(`${this.url}:update?${this.keyQuery}`, body)
            .pipe(catchError(this.setError.bind(this)), tap(this.setToken));
    }

    private setError(error: HttpErrorResponse) {
        switch (error.error.error.message) {
            case 'INVALID_EMAIL':
                this.alert.danger('Invalid email');
                break;
            case 'INVALID_PASSWORD':
                this.alert.danger('Invalid password');
                break;
            case 'EMAIL_NOT_FOUND':
                this.alert.danger('Email not found');
                break;
            case 'EMAIL_EXISTS':
                this.alert.danger('User with this email already exists');
                break;
            case 'WEAK_PASSWORD':
                this.alert.warning(
                    'Password should contain at least 8 characters'
                );
                break;
            case 'INVALID_ID_TOKEN':
            case 'CREDENTIAL_TOO_OLD_LOGIN_AGAIN':
                this.alert.warning('Session expired, please sign in again');
                this.logout();
                this.router.navigate(['/authentication']);
                break;
            case 'USER_NOT_FOUND':
                this.alert.danger('User not found');
                this.logout();
                this.router.navigate(['/authentication']);
                break;
        }

        return throwError(error);
    }

    private setToken(response: FirebaseAuthResponse | null): void {
        if (response) {
            if (response.idToken) {
                const expDate = new Date(
                    +response.expiresIn * 1000 + new Date().getTime()
                );
                localStorage.setItem('token', response.idToken);
                localStorage.setItem('token-exp', expDate.toString());
                localStorage.setItem('userId', response.localId);
            }
        } else {
            localStorage.clear();
            this.showProfile$.next(false);
        }
    }
}
