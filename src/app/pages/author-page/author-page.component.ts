import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';
import { Subscription, throwError } from 'rxjs';
import { mergeMap, map } from 'rxjs/operators';
import { UserData, Publication } from 'src/app/shared/interfaces';
import { UserService } from 'src/app/shared/services/user.service';
import { PublicationService } from 'src/app/shared/services/publication.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { AlertService } from 'src/app/shared/services/alert.service';

@Component({
    selector: 'app-author-page',
    templateUrl: './author-page.component.html',
    styleUrls: ['./author-page.component.scss'],
})
export class AuthorPageComponent implements OnInit, OnDestroy {
    author: UserData;
    authorNameValue = '';
    followBtnPressed = false;
    loading = true;
    notFoundAuthor = '';
    publications: Array<Publication> = [];
    user: UserData = { userId: '', username: '' };
    userSub: Subscription;

    constructor(
        private auth: AuthService,
        private alert: AlertService,
        private location: Location,
        private route: ActivatedRoute,
        private pubService: PublicationService,
        private userService: UserService
    ) {}

    ngOnInit(): void {
        // get user to know if user is subscribed on this author
        this.userSub = this.userService.userData$.subscribe((user) => {
            if (user) this.user = user;
        });
        // get author
        this.route.params.subscribe((params: Params) => {
            this.fetchAuhor(params.username);
        });
    }

    fetchAuhor(username: string) {
        this.userService
            .getAuthor(username)
            .pipe(
                mergeMap((response: { user: UserData }) => {
                    const author = (this.author = Object.values(response)[0]);

                    if (!author) {
                        return throwError(404);
                    }

                    // fetch author's publications
                    return this.pubService.getPublications(
                        'author',
                        author.username
                    );
                }),
                // leave only published
                // give them an avatar of the author
                // and sort by date of creation
                map((pubs: { publication: Publication }) => {
                    return Object.values(pubs)
                        .filter((p) => p.published === true)
                        .map((p) => {
                            p.authorAv = this.author.minAvatar;
                            return p;
                        })
                        .sort((a, b) => {
                            return (
                                Date.parse(b.created.toString()) -
                                Date.parse(a.created.toString())
                            );
                        });
                })
            )
            .subscribe(
                (publications: Publication[]) => {
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
                .subscribeOnAuthor(
                    isFollowing,
                    this.author.username,
                    this.author.userId
                )
                .subscribe((res) => {
                        this.author.subscribers = res.subscribers;
                        this.followBtnPressed = false;
                    },(e) => {
                        this.alert.danger('Something went wrong. Please, try again later')
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
