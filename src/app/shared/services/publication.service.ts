import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, forkJoin } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

import { environment } from 'src/environments/environment';
import { Publication, UserData, PubAllowedChanges } from '../interfaces';
import { UserService } from './user.service';
import { AlertService } from './alert.service';

@Injectable({ providedIn: 'root' })
export class PublicationService {
    publications$: Subject<Array<Publication>> = new Subject<
        Array<Publication>
    >();
    pubs: Array<Publication>;
    urlToPublications = `${environment.firebaseDbUrl}publications`;
    user: UserData;

    constructor(
        private alert: AlertService,
        private http: HttpClient,
        private userService: UserService
    ) {
        this.publications$.subscribe(
            (publications) => (this.pubs = publications)
        );
        this.userService.userData$.subscribe((user) => (this.user = user));
    }

    createPublication(publication: Publication): Observable<any> {
        return this.http
            .post<{ name: string }>(
                `${this.urlToPublications}.json`,
                publication
            )
            .pipe(
                mergeMap(({ name }) =>
                    this.http.patch(`${this.urlToPublications}/${name}.json`, {
                        link: name,
                    })
                ),
                mergeMap(() =>
                    this.http.patch(
                        `${environment.firebaseDbUrl}users/${this.user.userId}.json`,
                        {
                            publications: (this.user.publications || 0) + 1,
                        }
                    )
                )
            );
    }

    deletePublication(authorId: string, pubId: string): Observable<any> {
        if (authorId !== this.user.userId) {
            this.alert.danger(
                'Operation not allowed. You are not the author of this article.'
            );
            return;
        }

        const publications = this.user.publications - 1;

        return this.http.delete(`${this.urlToPublications}/${pubId}.json`).pipe(
            mergeMap(() => {
                return this.http.patch(
                    `${environment.firebaseDbUrl}users/${this.user.userId}.json`,
                    { publications }
                );
            })
        );
    }

    deletePublications(): Observable<any> {
        const deleteRequests = [];
        return this.getPublications('authorId', this.user.userId).pipe(
            mergeMap((posts: Object) => {
                const ids = Object.keys(posts);

                if (ids.length) {
                    for (let id of ids) {
                        deleteRequests.push(
                            this.http.delete(
                                `${this.urlToPublications}/${id}.json`
                            )
                        );
                    }
                    return forkJoin(deleteRequests);
                } else {
                    return new Observable((sub) => sub.next());
                }
            })
        );
    }

    dislikePublication(pubId: string): void {
        let dislikes = 0;
        let disliked = [].concat(this.user.disliked || []); // get an ids array of publications user dislked
        let liked = [].concat(this.user.liked || []); // same with liked

        // get most recent amount of dislikes pubilcation has
        this.http
            .get(`${this.urlToPublications}/${pubId}/dislikes.json`)
            .subscribe((value) => {
                dislikes = +value;

                if (!disliked.includes(pubId)) {
                    ++dislikes;
                    disliked.unshift(pubId);

                    if (liked.includes(pubId)) {
                        // cancel like if it was
                        this.likePublication(pubId);
                    }
                } else {
                    --dislikes;
                    disliked = disliked.filter((id) => id !== pubId);
                }

                // update data in service
                this.userService.userData$.next({ ...this.user, disliked });

                // update publication and user in database
                this.http
                    .patch(`${this.urlToPublications}/${pubId}.json`, {
                        dislikes,
                    })
                    .subscribe(() => {});
                this.http
                    .patch(
                        `${environment.firebaseDbUrl}users/${this.user.userId}.json`,
                        { disliked }
                    )
                    .subscribe(() => {});
            });
    }

    getPublication(id: string): Observable<Publication> {
        return this.http.get<Publication>(
            `${this.urlToPublications}/${id}.json`
        );
    }

    getPublications(filterBy: string, equalTo: string): Observable<any> {
        return this.http.get(
            `${this.urlToPublications}.json?orderBy="${filterBy}"&equalTo="${equalTo}"`
        );
    }

    getPublicationsFromSubs(
        usernames: Array<string>
    ): Observable<Publication[]> {
        const requests = [];

        for (let username of usernames) {
            requests.push(this.getPublications('author', username));
        }

        return forkJoin<{ publication: Publication }>(requests).pipe(
            map((response) => {
                const publications = response.map((obj) => Object.values(obj));
                return [].concat(...publications).filter((p) => p.published);
            })
        );
    }

    getSavedPublications(ids: Array<string>): Observable<Publication[]> {
        const requests = [];

        for (let id of ids) {
            requests.push(this.getPublication(id));
        }

        return forkJoin<Publication>(requests);
    }

    likePublication(pubId: string): void {
        // same as for dislike
        let likes = 0;
        let liked = [].concat(this.user.liked || []);
        let disliked = [].concat(this.user.disliked || []);

        this.http
            .get(`${this.urlToPublications}/${pubId}/likes.json`)
            .subscribe((value) => {
                likes = +value;

                if (!liked.includes(pubId)) {
                    ++likes;
                    liked.unshift(pubId);

                    if (disliked.includes(pubId)) {
                        // cancel dislike if it was
                        this.dislikePublication(pubId);
                    }
                } else {
                    --likes;
                    liked = liked.filter((id) => id !== pubId);
                }

                this.userService.userData$.next({ ...this.user, liked });

                this.http
                    .patch(`${this.urlToPublications}/${pubId}.json`, { likes })
                    .subscribe(() => {});
                this.http
                    .patch(
                        `${environment.firebaseDbUrl}users/${this.user.userId}.json`,
                        { liked }
                    )
                    .subscribe(() => {});
            });
    }

    publishPublication(pubId: string, state: boolean): Observable<any> {
        return this.http.patch(`${this.urlToPublications}/${pubId}.json`, {
            published: state,
        });
    }

    savePublication(pubId: string, _?: boolean): void {
        // get all saved publications
        let saved = [].concat(this.user.saved || []);

        // delete this passed publication if it was saved
        !saved.includes(pubId)
            ? saved.unshift(pubId)
            : // or add if it was not
              (saved = saved.filter((id) => id !== pubId));

        // save to service
        this.userService.userData$.next({ ...this.user, saved });

        // save updated user to the database
        this.http
            .patch(
                `${environment.firebaseDbUrl}users/${this.user.userId}.json`,
                { saved }
            )
            .subscribe(() => {});
    }

    updatePublication(
        modifications: PubAllowedChanges,
        authorId: string,
        pubId: string
    ): Observable<any> {
        if (authorId !== this.user.userId) {
            this.alert.danger(
                'Operation not allowed. You are not the author of this article.'
            );
            return;
        }
        return this.http.patch(
            `${this.urlToPublications}/${pubId}.json`,
            modifications
        );
    }
}
