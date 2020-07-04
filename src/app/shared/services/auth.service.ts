import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators'
import { UserCredentials, FirebaseAuthResponse, UserData } from '../interfaces';
import { environment } from 'src/environments/environment';
import { AlertService } from './alert.service';

@Injectable({providedIn: 'root'})
export class AuthService {
    showProfile$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false)

    constructor(
        private http: HttpClient,
        private alert: AlertService
    ) { }

    get token(): string {
        const expDate = new Date(localStorage.getItem('token-exp'))
        if (new Date() > expDate) {
          this.logout()
          return null
        }
        this.showProfile$.next(true)
        return localStorage.getItem('token')
    }

    createUser(userData: UserData): Observable<any> {
        return this.http.patch(`${environment.firebaseDbUrl}/users/${userData.userId}.json`, userData)
    }

    isAuthenticated(): boolean {
        return !!this.token
    }

    login(credentials: UserCredentials): Observable<any> {
        credentials.returnSecureToken = true
        return this.http.post(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.firebaseApiKey}`, credentials)
            .pipe(
                tap(this.setToken),
                catchError(this.setError.bind(this))
            )
    }

    logout(): void {
        this.setToken(null)
    }

    signup(credentials: UserCredentials): Observable<any> {
        credentials.returnSecureToken = true
        return this.http.post(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.firebaseApiKey}`, credentials)
            .pipe(
                tap(this.setToken),
                catchError(this.setError.bind(this))
            )
    }

    private setError(error: HttpErrorResponse) {
        const { message } = error.error.error
        switch(message) {
          case 'INVALID_EMAIL':
            this.alert.danger('Invalid email')
            break
          case 'INVALID_PASSWORD':
            this.alert.danger('Invalid password')
            break
          case 'EMAIL_NOT_FOUND':
            this.alert.danger('Email not found')
            break
        }

        return throwError(error)
    }

    private setToken(response: FirebaseAuthResponse | null): void {
        if (response) {
            const expDate = new Date(+response.expiresIn * 1000 + new Date().getTime())
            localStorage.setItem('token', response.idToken)
            localStorage.setItem('token-exp', expDate.toString())
            localStorage.setItem('userId', response.localId)
        } else {
            localStorage.clear()
            this.showProfile$.next(false)
        }
    }
}
