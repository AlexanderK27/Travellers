import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

// import { UserService } from '../user/user.service';
import { AlertService } from '../alert.service';
import { IServerResponse } from '../../interfaces'
import { INewPost, IPost, IPostAllowedChanges, IPostCard } from './post.interfaces';

interface IGetMyPostsServerResponse extends IServerResponse {
    payload: IPostCard[]
}

@Injectable({ providedIn: 'root' })
export class PostService {
    // posts$: Subject<IPost[]> = new Subject<IPost[]>();
    // posts: IPost[];

    constructor(
        private alert: AlertService,
        private http: HttpClient,
        // private userService: UserService
    ) {
        // this.posts$.subscribe(
        //     (posts) => (this.posts = posts)
        // );
    }

    createOne(post: INewPost): Observable<any> {
        return this.http.get('/')
        // return this.http
        //     .post<{ name: string }>(
        //         `${this.urlToPublications}.json`,
        //         post
        //     )
        //     .pipe(
        //         mergeMap(({ name }) =>
        //             this.http.patch(`${this.urlToPublications}/${name}.json`, {
        //                 link: name,
        //             })
        //         ),
        //         mergeMap(() =>
        //             this.http.patch(
        //                 `${environment.firebaseDbUrl}users/${this.user.userId}.json`,
        //                 {
        //                     publications: (this.user.posts || 0) + 1,
        //                 }
        //             )
        //         )
        //     );
    }

    deleteOne(id: number): Observable<any> {
        return this.http.get('/')
        // if (authorId !== this.user.userId) {
        //     this.alert.danger(
        //         'Operation not allowed. You are not the author of this article.'
        //     );
        //     return;
        // }

        // const publications = this.user.posts - 1;

        // return this.http.delete(`${this.urlToPublications}/${pubId}.json`).pipe(
        //     mergeMap(() => {
        //         return this.http.patch(
        //             `${environment.firebaseDbUrl}users/${this.user.userId}.json`,
        //             { publications }
        //         );
        //     })
        // );
    }

    // deleteMany(): Observable<any> {
    //     const deleteRequests = [];
    //     return this.getPublications('authorId', this.user.userId).pipe(
    //         mergeMap((posts: Object) => {
    //             const ids = Object.keys(posts);

    //             if (ids.length) {
    //                 for (let id of ids) {
    //                     deleteRequests.push(
    //                         this.http.delete(
    //                             `${this.urlToPublications}/${id}.json`
    //                         )
    //                     );
    //                 }
    //                 return forkJoin(deleteRequests);
    //             } else {
    //                 return new Observable((sub) => sub.next());
    //             }
    //         })
    //     );
    // }

    dislikeOne(id: number): void {
        // let dislikes = 0;
        // let disliked = [].concat(this.user.disliked || []); // get an ids array of publications user dislked
        // let liked = [].concat(this.user.liked || []); // same with liked

        // // get most recent amount of dislikes pubilcation has
        // this.http
        //     .get(`${this.urlToPublications}/${pubId}/dislikes.json`)
        //     .subscribe((value) => {
        //         dislikes = +value;

        //         if (!disliked.includes(pubId)) {
        //             ++dislikes;
        //             disliked.unshift(pubId);

        //             if (liked.includes(pubId)) {
        //                 // cancel like if it was
        //                 this.likePublication(pubId);
        //             }
        //         } else {
        //             --dislikes;
        //             disliked = disliked.filter((id) => id !== pubId);
        //         }

        //         // update data in service
        //         this.userService.userData$.next({ ...this.user, disliked });

        //         // update publication and user in database
        //         this.http
        //             .patch(`${this.urlToPublications}/${pubId}.json`, {
        //                 dislikes,
        //             })
        //             .subscribe(() => {});
        //         this.http
        //             .patch(
        //                 `${environment.firebaseDbUrl}users/${this.user.userId}.json`,
        //                 { disliked }
        //             )
        //             .subscribe(() => {});
        //     });
    }

    getOne(id: number): Observable<IPost> {
        return this.http.get<IPost>(
            `/${id}`
        );
        // return this.http.get<IPost>(
        //     `${this.urlToPublications}/${id}.json`
        // );
    }

    getMyPosts(): Observable<IPostCard[]> {
        // posts.forEach(p => {
        //     p.author_name = this.user.username
        //     p.author_avatar = this.user.minAvatar
        // })
        return this.http.get<IGetMyPostsServerResponse>('/api/post/my').pipe(
            map(({payload}) => payload),
            catchError(this.handleError.bind(this))
        )
    }

    getMany(filterBy: string, equalTo: string): Observable<any> {
        return this.http.get('/'
            // `${this.urlToPublications}.json?orderBy="${filterBy}"&equalTo="${equalTo}"`
        );
    }

    getManyFromFollowings(
        // usernames: string[]
    ): Observable<IPost[]> {
        return this.http.get<IPost[]>('/')
        // const requests = [];

        // for (let username of usernames) {
        //     requests.push(this.getPublications('author', username));
        // }

        // return forkJoin<{ publication: Publication }>(requests).pipe(
        //     map((response) => {
        //         const publications = response.map((obj) => Object.values(obj));
        //         return [].concat(...publications).filter((p) => p.published);
        //     })
        // );
    }

    getSaved(ids: number[]): Observable<IPost[]> {
        return this.http.get<IPost[]>('/')
        // const requests = [];

        // for (let id of ids) {
        //     requests.push(this.getPublication(id));
        // }

        // return forkJoin<Publication>(requests);
    }

    likeOne(id: number): void {
        // // same as for dislike
        // let likes = 0;
        // let liked = [].concat(this.user.liked || []);
        // let disliked = [].concat(this.user.disliked || []);

        // this.http
        //     .get(`${this.urlToPublications}/${pubId}/likes.json`)
        //     .subscribe((value) => {
        //         likes = +value;

        //         if (!liked.includes(pubId)) {
        //             ++likes;
        //             liked.unshift(pubId);

        //             if (disliked.includes(pubId)) {
        //                 // cancel dislike if it was
        //                 this.dislikePublication(pubId);
        //             }
        //         } else {
        //             --likes;
        //             liked = liked.filter((id) => id !== pubId);
        //         }

        //         this.userService.userData$.next({ ...this.user, liked });

        //         this.http
        //             .patch(`${this.urlToPublications}/${pubId}.json`, { likes })
        //             .subscribe(() => {});
        //         this.http
        //             .patch(
        //                 `${environment.firebaseDbUrl}users/${this.user.userId}.json`,
        //                 { liked }
        //             )
        //             .subscribe(() => {});
        //     });
    }

    changeStatus(id: number, status: string): void {

    }

    // publishOne(id: number): Observable<any> {
    //     return this.http.patch(`${this.urlToPublications}/${post_id}.json`, {
    //         published: state,
    //     });
    // }

    saveOne(id: number): void {
        // // get all saved publications
        // let saved = [].concat(this.user.saved || []);

        // // delete this passed publication if it was saved
        // !saved.includes(post_id)
        //     ? saved.unshift(post_id)
        //     : // or add if it was not
        //       (saved = saved.filter((id) => id !== post_id));

        // // save to service
        // this.userService.userData$.next({ ...this.user, saved });

        // // save updated user to the database
        // this.http
        //     .patch(
        //         `${environment.firebaseDbUrl}users/${this.user.userId}.json`,
        //         { saved }
        //     )
        //     .subscribe(() => {});
    }

    updateOne(
        modifications: IPostAllowedChanges,
        pubId: string
    ): Observable<any> {
        // if (authorId !== this.user.userId) {
        //     this.alert.danger(
        //         'Operation not allowed. You are not the author of this article.'
        //     );
        //     return;
        // }
        return this.http.patch('/',
            // `${this.urlToPublications}/${pubId}.json`,
            modifications
        );
    }

    private handleError(error: HttpErrorResponse): Observable<string> {
        const message = error.error.error
        this.alert.danger(message);

        return throwError(message)
    }
}
