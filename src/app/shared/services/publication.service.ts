import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Publication, UserData, PubAllowedChanges } from '../interfaces';
import { UserService } from './user.service';
import { AlertService } from './alert.service';

@Injectable({providedIn: 'root'})
export class PublicationService {
    urlToPublications = `${environment.firebaseDbUrl}publications`
    user: UserData

    constructor(
        private alert: AlertService,
        private http: HttpClient,
        private userService: UserService
    ) {
        this.userService.userData$.subscribe(user => {
            this.user = user
        })
    }

    createPublication(publication: Publication): Observable<any> {
        return this.http.post(`${this.urlToPublications}.json`, publication)
    }

    deletePublication(authorId: string, pubId: string): Observable<any> {
        if (authorId !== this.user.userId) {
            this.alert.danger('Operation not allowed. You are not the author of this article.')
            return
        }
        return this.http.delete(`${this.urlToPublications}/${pubId}.json`)
    }

    getMyPublications(): Observable<any> {
        return this.http.get(`${this.urlToPublications}.json?orderBy="authorId"&equalTo="${this.user.userId}"`)
    }

    getPublication(id: string): Observable<any> {
        return this.http.get(`${this.urlToPublications}/${id}.json`)
    }

    updatePublication(modifications: PubAllowedChanges, authorId: string, pubId: string): Observable<any> {
        if (authorId !== this.user.userId) {
            this.alert.danger('Operation not allowed. You are not the author of this article.')
            return
        }
        return this.http.patch(`${this.urlToPublications}/${pubId}.json`, modifications)
    }
}
