import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { BehaviorSubject, Observable, throwError } from 'rxjs';

import { AlertService } from 'src/app/shared/services/alert.service';
import { IUserBasicProfileData, IUserProfileData, IAuthorProfileData } from './user.interfaces';
import { IServerResponse } from '../../interfaces';
import { AuthService } from '../auth/auth.service';

interface IFetchAuthorServerResponse extends IServerResponse {
    payload: {
        profile: IAuthorProfileData;
        posts: Array<{
            title: string;
            poster: string;
            post_id: number;
            post_created_at: Date;
        }>
    }
}

interface IUpdateProfileServerResponse extends IServerResponse {
    payload?: string;
}

@Injectable({ providedIn: 'root' })
export class UserService {
    userData$: BehaviorSubject<IUserProfileData> = new BehaviorSubject<IUserProfileData>(null);

    constructor(
        private alert: AlertService,
        private auth: AuthService,
        private http: HttpClient
    ) {
        if (this.auth.isAuthenticated()) {
            this.getMyProfile().subscribe(user => this.userData$.next(user))
        }
    }

    deleteMyProfile(): Observable<string> {
        return this.http.delete('/api/user/account').pipe(
            catchError(this.handleError),
            map((res: IServerResponse) => {
                this.alert.success(res.message)
                return res.message;
            })
        )
    }

    fetchAuthor(username: string): Observable<IFetchAuthorServerResponse> {
        return this.http.get<IFetchAuthorServerResponse>(`/api/user/author/${username}`);
    }

    follow(author_username: string): Observable<string> {
        const body = { username: author_username }

        return this.http.post<IServerResponse>('/api/user/follow', body).pipe(
            catchError(this.handleError),
            map((res: IServerResponse) => res.message)
        )
    }

    getMyProfile(): Observable<IUserProfileData> {
        return this.http.get('/api/user/profile').pipe(
            catchError((error: HttpErrorResponse): Observable<never> => {
                return error.status === 401 ? throwError(error) : this.handleError(error);
            }),
            map((res: { payload: IUserProfileData }) => res.payload),
        );
    }

    updateProfile(updates: IUserBasicProfileData): Observable<string> {
        return this.http.patch('/api/user/profile', updates)
            .pipe(
                map((res: IUpdateProfileServerResponse) => {
                    this.alert.success(res.message);
                    return res.payload
                }),
                catchError(this.handleError.bind(this))
            )
    }

    private handleError = (error: HttpErrorResponse): Observable<never> => {
        const message = error.error.error;
        this.alert.danger(message);
        return throwError(message)
    }
}
