import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Publication } from '../interfaces';

@Injectable({providedIn: 'root'})
export class PublicationService {

    constructor(
        private http: HttpClient
    ) { }

    createPublication(publication: Publication): Observable<any> {
        return this.http.post(`${environment.firebaseDbUrl}/publications.json`, publication)
    }

    getMyPublications(userId: string): Observable<any> {
        return this.http.get(`${environment.firebaseDbUrl}publications.json?orderBy="authorId"&equalTo="WwGh4LS8ZlZe1NWadd4YKyQlRex1"`)
        // return this.http.get(`${environment.firebaseDbUrl}publications.json?orderBy="authorId"&equalTo=${userId}`)
    }
}
