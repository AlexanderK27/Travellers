import { AlertService } from 'src/app/shared/services/alert.service';
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { BehaviorSubject, Subscription, Observable, throwError } from 'rxjs';

import { environment } from 'src/environments/environment';
// import { UserData } from '../../interfaces';
import { AuthService } from '../auth.service';
import { IUserProfileData } from './user.interfaces';
import { IPostCard } from '../post/post.interfaces';


@Injectable({ providedIn: 'root' })
export class UserService {
    urlToNames = `${environment.firebaseDbUrl}names`;
    urlToUsers = `${environment.firebaseDbUrl}users`;
    user: IUserProfileData;
    userSub: Subscription;
    userData$: BehaviorSubject<IUserProfileData> = new BehaviorSubject<IUserProfileData>(null);

    constructor(private alert: AlertService, private auth: AuthService, private http: HttpClient) {
        const userId = localStorage.getItem('userId');

        if (userId) {
            if (this.auth.isAuthenticated()) {
                this.fetchOne(userId).subscribe((user) => {
                    user ? this.userData$.next(user) : this.auth.logout();
                });
            }
        } else {
            this.auth.logout();
        }

        this.userSub = this.userData$.subscribe((user) => (this.user = user));
    }

    deleteMyProfile(): Observable<any> {
        return this.http.delete('/');
        // return this.http.delete(`${this.urlToUsers}/${this.user.userId}.json`);
    }

    fetchOne(username: string): Observable<any> {
        return this.http.get('/')
        // return this.http.get(`${this.urlToUsers}/${userId}.json`);
    }

    getMyProfile(): Observable<{ user: IUserProfileData, posts: IPostCard[] }> {
        return this.http.get<{ user: IUserProfileData, posts: IPostCard[] }>('/api/user/profile')
            .pipe(
                map(res => {
                    const { username, minAvatar } = res.user;
                    res.posts.forEach(p => {
                        p.author_name = username
                        p.author_avatar = minAvatar
                    })
                    return res
                }),
                catchError(this.handleError.bind(this))
            );
    }

    getAuthor(username: string): Observable<any> {
        return this.http.get(
            `${this.urlToUsers}.json?orderBy="username"&equalTo="${username}"`
        );
    }

    isUsernameFree(username: string): Observable<boolean> {
        return this.http.get<boolean>('/')
        // return this.http.get<string>(
        //     `${this.urlToNames}.json?orderBy="username"&equalTo="${username}"`
        // );
    }

    // saveUsername(username: string): Observable<any> {
    //     return this.http.post(`${this.urlToNames}.json`, { username });
    // }

    follow(
        author_name: string
    ): Observable<any> {

        return this.http.get('/')
        // save data of logged in user
        // const subscriptions = subscribe
        //     ? [aUsername].concat(this.user.followings || [])
        //     : this.user.followings.filter((name) => name !== aUsername);
        // this.http
        //     .patch(`${this.urlToUsers}/${this.user.userId}.json`, {
        //         subscriptions,
        //     })
        //     .subscribe(() => {
        //         this.userData$.next({ ...this.user, subscriptions });
        //     });

        // save author's data = get actual subscribers and add or subtract one
        // return this.getAuthor(aUsername).pipe(
        //     mergeMap((author: { key: UserData }) => {
        //         const authorSubs =
        //             (Object.values(author)[0].subscribers || 0) +
        //             (subscribe ? 1 : -1);

        //         return this.http.patch(`${this.urlToUsers}/${authorId}.json`, {
        //             subscribers: authorSubs,
        //         });
        //     })
        // );
    }

    updateProfile(updates: Object): Observable<any> {
        return this.http.patch(
            '/', // `${this.urlToUsers}/${this.user.userId}.json`,
            updates
        );
    }

    private handleError(error: HttpErrorResponse): Observable<string> {
        const message = error.error.error
        this.alert.danger(message);

        return throwError(message)
    }
}
