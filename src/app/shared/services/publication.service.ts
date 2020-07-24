import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, forkJoin, EMPTY } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Publication, UserData, PubAllowedChanges } from '../interfaces';
import { UserService } from './user.service';
import { AlertService } from './alert.service';
import { map, mergeMap } from 'rxjs/operators';

@Injectable({providedIn: 'root'})
export class PublicationService {
    publications$: Subject<Array<Publication>> = new Subject<Array<Publication>>()
    pubs: Array<Publication>
    urlToPublications = `${environment.firebaseDbUrl}publications`
    user: UserData

    constructor(
        private alert: AlertService,
        private http: HttpClient,
        private userService: UserService
    ) {
        this.publications$.subscribe(publications => this.pubs = publications)
        this.userService.userData$.subscribe(user => this.user = user)
    }

    createPublication(publication: Publication): Observable<any> {
        return this.http.post<{name: string}>(`${this.urlToPublications}.json`, publication)
            .pipe(
                mergeMap(({name}) => this.http.patch(`${this.urlToPublications}/${name}.json`, {link: name})),
                mergeMap(() => this.http.patch(`${environment.firebaseDbUrl}users/${this.user.userId}.json`, {
                    publications: (this.user.publications || 0) + 1
                }))
            )
    }

    deletePublication(authorId: string, pubId: string): Observable<any> {
        if (authorId !== this.user.userId) {
            this.alert.danger('Operation not allowed. You are not the author of this article.')
            return
        }
        return this.http.delete(`${this.urlToPublications}/${pubId}.json`)
    }

    deletePublications(): Observable<any> {
        const deleteRequests = []
        return this.getPublications("authorId", this.user.userId).pipe(
            mergeMap((posts: Object) => {
                const ids = Object.keys(posts)

                if (ids.length) {
                    for (let id of ids) {
                        deleteRequests.push(this.http.delete(`${this.urlToPublications}/${id}.json`))
                    }
                    return forkJoin(deleteRequests)
                } else {
                    return new Observable(sub => sub.next())
                }
            })
        )
    }

    dislikePublication(pubId: string): void {
        let dislikes = 0
        let disliked = [].concat(this.user.disliked || [])

        this.http.get(`${this.urlToPublications}/${pubId}/dislikes.json`).subscribe(value => {
            dislikes = +value

            if (!disliked.includes(pubId)) {
                ++dislikes
                disliked.unshift(pubId)
            } else {
                --dislikes
                disliked = disliked.filter(id => id !== pubId)
            }

            this.userService.userData$.next({ ...this.user, disliked })
            this.pubs.forEach(pub => {
                if (pub.link === pubId) pub.dislikes = dislikes
            })
            this.publications$.next(this.pubs)

            this.http.patch(`${this.urlToPublications}/${pubId}.json`, {dislikes}).subscribe(() => {})
            this.http.patch(`${environment.firebaseDbUrl}users/${this.user.userId}.json`, {disliked}).subscribe(() => {})
        })
    }

    getPublication(id: string): Observable<Publication> {
        return this.http.get<Publication>(`${this.urlToPublications}/${id}.json`)
    }

    getPublications(filterBy: string, equalTo: string): Observable<any> {
        return this.http.get(`${this.urlToPublications}.json?orderBy="${filterBy}"&equalTo="${equalTo}"`)
    }

    getPublicationsFromSubs(usernames: Array<string>): Observable<Publication[]> {
        const requests = []

        for (let username of usernames) {
            requests.push(this.getPublications('author', username))
        }

        return forkJoin<{publication: Publication}>(requests).pipe(
            map(response => {
                const publications = response.map(obj => Object.values(obj))
                return [].concat(...publications).filter(p => p.published)
            })
        )
    }

    getSavedPublications(ids: Array<string>): Observable<Publication[]> {
        const requests = []

        for (let id of ids) {
            requests.push(this.getPublication(id))
        }

        return forkJoin<Publication>(requests)
    }

    getTopPublications() {
        return this.http.get(`${this.urlToPublications}.json?orderBy="likes"&limitToLast=12`)
    }

    likePublication(pubId: string): void {
        let likes = 0
        let liked = [].concat(this.user.liked || [])

        this.http.get(`${this.urlToPublications}/${pubId}/likes.json`).subscribe(value => {
            likes = +value

            if (!liked.includes(pubId)) {
                ++likes
                liked.unshift(pubId)
            } else {
                --likes
                liked = liked.filter(id => id !== pubId)
            }

            this.userService.userData$.next({ ...this.user, liked })
            this.pubs.forEach(pub => {
                if (pub.link === pubId) pub.likes = likes
            })
            this.publications$.next(this.pubs)

            this.http.patch(`${this.urlToPublications}/${pubId}.json`, {likes}).subscribe(() => {})
            this.http.patch(`${environment.firebaseDbUrl}users/${this.user.userId}.json`, {liked}).subscribe(() => {})
        })
    }

    publishPublication(pubId: string, state: boolean): Observable<any> {
        return this.http.patch(`${this.urlToPublications}/${pubId}.json`, {published: state})
    }

    savePublication(pubId: string, savedPage: boolean): void {
        let saved = [].concat(this.user.saved || [])
        !saved.includes(pubId) ? saved.unshift(pubId) : saved = saved.filter(id => id !== pubId)
        this.userService.userData$.next({ ...this.user, saved })

        if (savedPage) {
            const savedPubs = this.pubs.filter(pub => pub.link !== pubId)
            this.publications$.next(savedPubs)
        }

        this.http.patch(`${environment.firebaseDbUrl}users/${this.user.userId}.json`, {saved}).subscribe(() => {})
    }

    updatePublication(modifications: PubAllowedChanges, authorId: string, pubId: string): Observable<any> {
        if (authorId !== this.user.userId) {
            this.alert.danger('Operation not allowed. You are not the author of this article.')
            return
        }
        return this.http.patch(`${this.urlToPublications}/${pubId}.json`, modifications)
    }
}
