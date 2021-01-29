import { Component, OnInit, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { take, switchMap } from 'rxjs/operators';
import { Subscription } from 'rxjs';

import { PublicationService } from 'src/app/shared/services/post/post.service';
import { UserService } from 'src/app/shared/services/user/user.service';
import { AvatarService } from 'src/app/shared/services/avatar.service';
import { IPost } from 'src/app/shared/services/post/post.interfaces';

interface publicationsSortedByDate {
    today: IPost[];
    yesterday: IPost[];
    week: IPost[];
    month: IPost[];
    earlier: IPost[];
}

@Component({
    selector: 'app-subs-page',
    templateUrl: './subs-page.component.html',
    styleUrls: ['./subs-page.component.scss'],
})
export class SubsPageComponent implements OnInit, OnDestroy {
    loading = true;
    noContent = true;
    publications: publicationsSortedByDate = {
        today: [],
        yesterday: [],
        week: [],
        month: [],
        earlier: [],
    };
    uSub: Subscription;

    constructor(
        private avatarService: AvatarService,
        private pubService: PublicationService,
        private userService: UserService,
        private title: Title
    ) {}

    ngOnInit() {
        this.title.setTitle('Subscriptions • Travellers');

        this.uSub = this.userService.userData$
            .pipe(take(2))
            .subscribe((user) => {
                if (!user) {
                    return;
                }

                if (user.followings) {
                    let publications: IPost[] = [];

                    // fetch publications
                    this.pubService
                        .getManyFromFollowings()
                        .pipe(
                            switchMap((pubs) => {
                                publications = pubs;

                                // fetch avatars
                                const usernames = pubs.map((p) => p.author_name);
                                return this.avatarService.getMinAvatars(
                                    usernames
                                );
                            }),
                            take(1)
                        )
                        .subscribe((avatars) => {
                            // assing avatars
                            publications.forEach((pub) => {
                                pub.author_avatar = avatars.find(
                                    (a) => a.username === pub.author_name
                                ).avatar;
                            });

                            if (publications.length) {
                                this.noContent = false;
                                this.publications = {
                                    ...this.sortToGroupsByDate(publications),
                                };
                            }

                            this.loading = false;
                        });
                } else {
                    this.loading = false;
                }
            });
    }

    ngOnDestroy() {
        this.uSub.unsubscribe();
    }

    private sortByDate(publications: IPost[]): IPost[] {
        return publications.sort(
            (a, b) =>
                Date.parse(b.post_created_at.toString()) -
                Date.parse(a.post_created_at.toString())
        );
    }

    private sortToGroupsByDate(
        publications: IPost[]
    ): publicationsSortedByDate {
        const pSorted = [[], [], [], [], []];
        const now = new Date().getTime();

        for (let p of publications) {
            const published = p.post_modified_at
                ? new Date(p.post_modified_at).getTime()
                : new Date(p.post_created_at).getTime();
            const timePassed = now - published;
            if (timePassed <= 24 * 3600000) {
                pSorted[0].unshift(p);
            } else if (timePassed <= 48 * 3600000) {
                pSorted[1].unshift(p);
            } else if (timePassed <= 7 * 24 * 3600000) {
                pSorted[2].unshift(p);
            } else if (timePassed <= 30 * 24 * 3600000) {
                pSorted[3].unshift(p);
            } else {
                pSorted[4].unshift(p);
            }
        }

        return {
            today: this.sortByDate(pSorted[0]),
            yesterday: this.sortByDate(pSorted[1]),
            week: this.sortByDate(pSorted[2]),
            month: this.sortByDate(pSorted[3]),
            earlier: this.sortByDate(pSorted[4]),
        };
    }
}
