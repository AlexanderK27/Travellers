import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap, catchError } from 'rxjs/operators'
import { UserCredentials, FirebaseAuthResponse } from '../interfaces';
import { environment } from 'src/environments/environment';


@Injectable({providedIn: 'root'})
export class AuthService {
    showProfile$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false)

    constructor(
        private http: HttpClient
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

    isAuthenticated(): boolean {
        return !!this.token
    }

    login(credentials: UserCredentials): Observable<any> {
        credentials.returnSecureToken = true
        console.log(credentials)
        return this.http.post(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.firebaseApiKey}`, credentials)
            .pipe(
                tap(this.setToken),
                // catchError(this.setError.bind(this))
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
                // catchError(this.setError.bind(this))
            )
    }

    // private setError(error: HttpErrorResponse) {
    //     console.log(error)
    // }

    private setToken(response: FirebaseAuthResponse | null): void {
        if (response) {
            const expDate = new Date(+response.expiresIn * 1000 + new Date().getTime())
            localStorage.setItem('token', response.idToken)
            localStorage.setItem('token-exp', expDate.toString())
        } else {
            localStorage.clear()
            this.showProfile$.next(false)
        }
    }
}
