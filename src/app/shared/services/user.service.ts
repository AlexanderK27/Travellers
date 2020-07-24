import { Injectable } from '@angular/core';
import { BehaviorSubject, Subscription, Observable } from 'rxjs';
import { UserData } from '../interfaces';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map, mergeMap } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({providedIn: 'root'})
export class UserService {
    urlToNames = `${environment.firebaseDbUrl}names`
    urlToUsers = `${environment.firebaseDbUrl}users`
    user: UserData
    userSub: Subscription
    userData$: BehaviorSubject<UserData> = new BehaviorSubject<UserData>(null)

    constructor(private auth: AuthService, private http: HttpClient) {
        const userId = localStorage.getItem('userId')

        if (userId) {
            if (this.auth.isAuthenticated()) {
                this.fetchUser(userId).subscribe(user => {
                    user ? this.userData$.next(user) : this.auth.logout()
                })
            }
        } else {
            this.auth.logout()
        }

        this.userSub = this.userData$.subscribe(user => this.user = user)
    }

    deleteUser(): Observable<any> {
        return this.http.delete(`${this.urlToUsers}/${this.user.userId}.json`)
    }

    fetchUser(userId: string): Observable<any> {
        return this.http.get(`${this.urlToUsers}/${userId}.json`)
    }

    getAuthor(username: string): Observable<any> {
        return this.http.get(`${this.urlToUsers}.json?orderBy="username"&equalTo="${username}"`)
    }

    getUsername(username: string): Observable<string> {
        return this.http.get<string>(`${this.urlToNames}.json?orderBy="username"&equalTo="${username}"`)
    }

    saveUsername(username: string): Observable<any> {
        return this.http.post(`${this.urlToNames}.json`, {username})
    }

    subscribeOnAuthor(subscribe: boolean, aUsername: string, authorId: string): Observable<any> {
        // save data of logged in user
        const subscriptions = subscribe
            ? [aUsername].concat(this.user.subscriptions || [])
            : this.user.subscriptions.filter(name => name !== aUsername)
        this.http.patch(`${this.urlToUsers}/${this.user.userId}.json`, {subscriptions}).subscribe(() => {
            this.userData$.next({...this.user, subscriptions})
        })

        // save author's data = get actual subscribers and add or subtract one
        return this.getAuthor(aUsername).pipe(
            mergeMap((author: {key: UserData}) => {
                const authorSubs = (Object.values(author)[0].subscribers || 0) + (subscribe ? 1 : -1)

                return this.http.patch(`${this.urlToUsers}/${authorId}.json`, {subscribers: authorSubs})
            })
        )
    }

    updateProfile(updates: Object): Observable<any> {
        return this.http.patch(`${this.urlToUsers}/${this.user.userId}.json`, updates)
    }
}
