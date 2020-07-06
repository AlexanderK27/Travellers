import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Publication, UserData } from '../interfaces';
import { UserService } from './user.service';

@Injectable({providedIn: 'root'})
export class PublicationService {
    user: UserData

    constructor(
        private http: HttpClient,
        private userService: UserService
    ) {
        this.userService.userData$.subscribe(user => {
            this.user = user
        })
    }

    createPublication(publication: Publication): Observable<any> {
        return this.http.post(`${environment.firebaseDbUrl}publications.json`, publication)
    }

    getMyPublications(): Observable<any> {
        return this.http.get(`${environment.firebaseDbUrl}publications.json?orderBy="authorId"&equalTo="${this.user.userId}"`)
    }

    getPublication(id: string): Observable<any> {
        return this.http.get(`${environment.firebaseDbUrl}publications/${id}.json`)
    }
}
