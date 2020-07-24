import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserService } from './user.service';
import { UserData, Comment } from '../interfaces';
import { environment } from 'src/environments/environment';
import { mergeMap } from 'rxjs/operators';
import { PublicationService } from './publication.service';

@Injectable({providedIn: 'root'})
export class CommentService {
    urlToComments = `${environment.firebaseDbUrl}comments`
    user: UserData

    constructor(
        private http: HttpClient,
        private pubService: PublicationService,
        private userService: UserService
    ) {
        this.userService.userData$.subscribe(user => this.user = user)
    }

    commentPublication(pubId: string, text: string, commentId?: string): Observable<any> {
        const comment: Comment = {
            created: new Date(),
            username: this.user.username,
            text
        }

        const saveComment = this.http.post(`${this.urlToComments}/${pubId}.json`, comment)
        const saveAnswer = this.http.post(`${this.urlToComments}/${pubId}/${commentId}/answers.json`, comment)

        return (commentId ? saveAnswer : saveComment).pipe(
            mergeMap(() => this.pubService.getPublication(pubId)),
            mergeMap(publication => (
                this.http.patch(`${environment.firebaseDbUrl}publications/${pubId}.json`, {
                    comments: (publication.comments || 0) + 1
                })
            ))
        )
    }

    getComments(pubId: string): Observable<any> {
        return this.http.get(`${this.urlToComments}/${pubId}.json`)
    }
}
