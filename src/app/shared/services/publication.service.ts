import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, Subject, forkJoin } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Publication, UserData, PubAllowedChanges } from '../interfaces';
import { UserService } from './user.service';
import { AlertService } from './alert.service';
import { mergeMap } from 'rxjs/operators';

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
        return this.getMyPublications().pipe(
            mergeMap((posts: Object) => {
                for (let id of Object.keys(posts)) {
                    deleteRequests.push(this.http.delete(`${this.urlToPublications}/${id}.json`))
                }
                return forkJoin(deleteRequests)
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

    getMyPublications(): Observable<any> {
        return this.http.get(`${this.urlToPublications}.json?orderBy="authorId"&equalTo="${this.user.userId}"`)
    }

    getPublication(id: string): Observable<any> {
        return this.http.get(`${this.urlToPublications}/${id}.json`)
    }

    getPublications(filterBy: string, equalTo: string): Observable<any> {
        return this.http.get(`${this.urlToPublications}.json?orderBy="${filterBy}"&equalTo="${equalTo}"`)
    }

    getPublicationsFromSubs() {
        const requests = []
        if (this.user.subscriptions && this.user.subscriptions.length) {
            for (let username of this.user.subscriptions) {
                requests.push(this.getPublications('author', username))
            }
            forkJoin(requests).subscribe((response: {key: Publication[]}[]) => {
                let publications = []
                response.forEach(obj => publications.push(...Object.values(obj)))
                this.publications$.next(publications.filter(p => p.published === true))
            })
        } else {
            this.publications$.next([])
        }
    }

    getSavedPublications() {
        const requests = []
        if (this.user.saved && this.user.saved.length) {
            for (let ids of this.user.saved) {
                requests.push(this.getPublication(ids))
            }
            forkJoin(requests).subscribe((pubs: Publication[]) => this.publications$.next(pubs))
        } else {
            this.publications$.next([])
        }
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
