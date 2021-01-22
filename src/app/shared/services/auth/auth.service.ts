import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError, of } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';

import { IServerResponse } from '../../interfaces';
import { AlertService } from '../alert.service';
import { IUserCredentials, IUserProfileData } from '../user/user.interfaces';

interface IAuthServerResponse extends IServerResponse {
    payload?: IUserProfileData
}

interface ISignupCredentials extends IUserCredentials {
    username: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
    showProfile$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    constructor(
        private alert: AlertService,
        private http: HttpClient
    ) {}

    get token(): string {
        const token = localStorage.getItem('t');

        if (!token) {
            this.logout();
            return '';
        }

        this.showProfile$.next(true);
        return token;
    }

    deleteAccount(): Observable<any> {
        return this.http.post(`/`, '')
        // const token = { idToken: this.token };
        // return this.http
        //     .post(`/`, token)
        //     .pipe(catchError(this.setError.bind(this)));
    }

    isAuthenticated(): boolean {
        return !!this.token;
    }

    isUsernameTaken(username: string): Observable<boolean> {
        return this.http.get(`/api/auth/check/${username}`)
            .pipe(
                map((res: IServerResponse) => {
                    console.log(res, res.message)
                    return res.message !== 'Free'
                }),
                catchError(error => {
                    this.alert.danger(error.error.error);
                    return of(true);
                })
            )
    }

    login(credentials: IUserCredentials): Observable<IAuthServerResponse> {
        return this.http
            .post<IAuthServerResponse>('/api/auth/login', credentials)
            .pipe(catchError(this.setError), tap(this.setToken));
    }

    logout(): void {
        this.setToken(null);
    }

    signup(credentials: ISignupCredentials): Observable<IUserProfileData> {
        return this.http.post('/api/auth/signup', credentials)
            .pipe(
                catchError(this.setError),
                tap(this.setToken),
                map((res: IAuthServerResponse) => {
                    this.alert.success(res.message)
                    return res.payload
                })
            )
    }

    updateEmailOrPassword(newValue: { email: string } | { password: string }): Observable<any> {
        return this.http.post(`/`, '')
        // const body = {
        //     idToken: this.token,
        //     returnSecureToken: true,
        //     ...newValue,
        // };

        // return this.http
        //     .post(`/`, body)
        //     .pipe(catchError(this.setError.bind(this)), tap(this.setToken));
    }


    private setError = (error: HttpErrorResponse) => {
        this.alert.danger(error.error.error)
        return throwError(error);
    }

    private setToken = (response: IAuthServerResponse | null) => {
        if (response) {
            if (response.payload) {
                localStorage.setItem('t', '1');
                this.showProfile$.next(true);
            }
        } else {
            localStorage.clear();
            this.showProfile$.next(false);
        }
    }
}
