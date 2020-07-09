import { Injectable } from '@angular/core';
import { BehaviorSubject, Subscription, Observable } from 'rxjs';
import { UserData, ProfileData } from '../interfaces';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { mergeMap } from 'rxjs/operators';

@Injectable({providedIn: 'root'})
export class UserService {
    urlToUsers = `${environment.firebaseDbUrl}users`
    user: UserData
    userSub: Subscription
    userData$: BehaviorSubject<UserData> = new BehaviorSubject<UserData>({
        userId: '',
        username: ''
    })

    constructor(
        private http: HttpClient
    ) {
        this.userSub = this.userData$.subscribe(user => {
            this.user = user
        })
    }

    fetchUser(userId: string): Observable<any> {
        return this.http.get(`${this.urlToUsers}/${userId}.json`)
    }

    getAuthor(username: string): Observable<any> {
        return this.http.get(`${this.urlToUsers}.json?orderBy="username"&equalTo="${username}"`)
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

    updateProfile(profileData: ProfileData): Observable<any> {
        return this.http.patch(`${this.urlToUsers}/${this.user.userId}.json`, profileData)
    }
}
