import { Injectable } from '@angular/core';
import { BehaviorSubject, Subscription, Observable } from 'rxjs';
import { UserData, ProfileData } from '../interfaces';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { tap } from 'rxjs/operators';

@Injectable({providedIn: 'root'})
export class UserService {
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

    updateProfile(profileData: ProfileData): Observable<any> {
        return this.http.patch(`${environment.firebaseDbUrl}/users/${this.user.userId}.json`, profileData)
    }
}
