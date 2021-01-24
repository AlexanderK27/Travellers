import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError, of } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';

import { IServerResponse } from '../../interfaces';
import { AlertService } from '../alert.service';
import { IUserCredentials, IUserProfileData } from '../user/user.interfaces';

interface IAuthServerResponse extends IServerResponse {
    payload: IUserProfileData
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

    isAuthenticated(): boolean {
        return !!this.token;
    }

    isUsernameTaken(username: string): Observable<boolean> {
        return this.http.get(`/api/auth/check/${username}`).pipe(
            catchError(error => {
                this.alert.danger(error.error.error);
                return of(true);
            }),
            map((res: IServerResponse) => res.message !== 'Free')
        )
    }

    login(credentials: IUserCredentials): Observable<IAuthServerResponse> {
        return this.http
            .post<IAuthServerResponse>('/api/auth/login', credentials)
            .pipe(catchError(this.setError), tap(this.setToken));
    }

    logout() {
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

    private setError = (error: HttpErrorResponse): Observable<never> => {
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
