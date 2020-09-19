import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from 'src/environments/environment';
import { ImageSource } from '../components/img-picker/image-picker.service';
import { MiniatureAvatar } from '../interfaces';

@Injectable({ providedIn: 'root' })
export class AvatarService {
    usersAvatars$: BehaviorSubject<MiniatureAvatar[]> = new BehaviorSubject<
        MiniatureAvatar[]
    >([]);

    constructor(private http: HttpClient) {}

    addAvatarsToAvStream(avatars: MiniatureAvatar[]) {
        const aSub = this.usersAvatars$.subscribe((a) => {
            this.usersAvatars$.next(a.concat(avatars));
        });
        aSub.unsubscribe();
    }

    getMinAvatars(usernames: Array<string>): Observable<MiniatureAvatar[]> {
        return new Observable((subscriber) => {
            const minAvatars = [];
            const notMatchedNames = [];
            const aSub = this.usersAvatars$.subscribe((avatars) => {
                usernames.forEach((name) => {
                    const avatar = avatars.find((a) => a.username === name);
                    avatar
                        ? minAvatars.push(avatar)
                        : notMatchedNames.push(name);
                });

                if (notMatchedNames.length) {
                    this.fetchMinAvatars(notMatchedNames).subscribe((a) => {
                        minAvatars.push(...a);
                        this.usersAvatars$.next(avatars.concat(a));
                        subscriber.next(minAvatars);
                    });
                } else {
                    subscriber.next(minAvatars);
                }
            });
            aSub.unsubscribe();
        });
    }

    saveMinAvatar(username: string, avatar: ImageSource): Observable<any> {
        return this.http.patch(
            `${environment.firebaseDbUrl}avatars/${username}.json`,
            { username, avatar }
        );
    }

    private fetchMinAvatar(username: string): Observable<MiniatureAvatar> {
        return this.http
            .get<MiniatureAvatar>(
                `${environment.firebaseDbUrl}avatars/${username}.json`
            )
            .pipe(
                map((minAvatar) =>
                    minAvatar ? minAvatar : { username, avatar: '' }
                )
            );
    }

    private fetchMinAvatars(
        usernames: Array<string>
    ): Observable<MiniatureAvatar[]> {
        const requests = [];
        new Set(usernames).forEach((name) =>
            requests.push(this.fetchMinAvatar(name))
        );

        return forkJoin<MiniatureAvatar>(requests);
    }
}
