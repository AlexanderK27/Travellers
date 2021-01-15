import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { Location } from '@angular/common';
import { Subscription, throwError } from 'rxjs';
import { mergeMap, map } from 'rxjs/operators';

import { UserService } from 'src/app/shared/services/user/user.service';
import { PublicationService } from 'src/app/shared/services/post/post.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { AlertService } from 'src/app/shared/services/alert.service';
import { IUserProfileData } from 'src/app/shared/services/user/user.interfaces';
import { IPost } from 'src/app/shared/services/post/post.interfaces';

@Component({
    selector: 'app-author-page',
    templateUrl: './author-page.component.html',
    styleUrls: ['./author-page.component.scss'],
})
export class AuthorPageComponent implements OnInit, OnDestroy {
    author: IUserProfileData;
    authorNameValue = '';
    followBtnPressed = false;
    loading = true;
    notFoundAuthor = '';
    publications: IPost[] = [];
    user: IUserProfileData;
    userSub: Subscription;

    constructor(
        private auth: AuthService,
        private alert: AlertService,
        private location: Location,
        private route: ActivatedRoute,
        private pubService: PublicationService,
        private title: Title,
        private userService: UserService
    ) {}

    ngOnInit(): void {
        // get user to know if user is subscribed on this author
        this.userSub = this.userService.userData$.subscribe((user) => {
            if (user) this.user = user;
        });
        // get author
        this.route.params.subscribe((params: Params) => {
            this.title.setTitle(
                `${params.username} | Author Profile • Travellers`
            );
            this.fetchAuhor(params.username);
        });
    }

    fetchAuhor(username: string) {
        this.userService
            .getAuthor(username)
            .pipe(
                mergeMap((response: { user: IUserProfileData }) => {
                    const author = (this.author = Object.values(response)[0]);

                    if (!author) {
                        return throwError(404);
                    }

                    // fetch author's publications
                    return this.pubService.getMany(
                        'author',
                        author.username
                    );
                }),
                // leave only published
                // give them an avatar of the author
                // and sort by date of creation
                map((pubs: { publication: IPost }) => {
                    return Object.values(pubs)
                        // .filter((p) => p.published === true)
                        .map((p) => {
                            p.author_avatar = this.author.minAvatar;
                            return p;
                        })
                        .sort((a, b) => {
                            return (
                                Date.parse(b.post_created_at.toString()) -
                                Date.parse(a.post_created_at.toString())
                            );
                        });
                })
            )
            .subscribe(
                (publications: IPost[]) => {
                    if (publications.length) {
                        this.publications = publications;
                    }
                    this.notFoundAuthor = '';
                    this.loading = false;
                },
                (e) => {
                    if (e === 404) {
                        this.notFoundAuthor = username;
                        this.loading = false;
                    } else {
                        this.alert.danger(
                            'Unknown error. Unable to load profile'
                        );
                    }
                }
            );
    }

    followAuthor(isFollowing: boolean) {
        if (this.auth.isAuthenticated()) {
            this.followBtnPressed = true;
            this.userService
                .follow(
                    this.author.username,
                )
                .subscribe(
                    (res) => {
                        this.author.followers = res.followers;
                        this.followBtnPressed = false;
                    },
                    (e) => {
                        this.alert.danger(
                            'Something went wrong. Please, try again later'
                        );
                    }
                );
        } else {
            this.alert.warning('Please authorize');
        }
    }

    navigateBack() {
        this.location.back();
    }

    ngOnDestroy(): void {
        this.userSub.unsubscribe();
    }
}
