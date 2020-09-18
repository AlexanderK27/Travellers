import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { take, switchMap } from 'rxjs/operators';
import { Publication } from 'src/app/shared/interfaces';
import { PublicationService } from 'src/app/shared/services/publication.service';
import { UserService } from 'src/app/shared/services/user.service';
import { AvatarService } from 'src/app/shared/services/avatar.service';

interface publicationsSortedByDate {
    today: Array<Publication>;
    yesterday: Array<Publication>;
    week: Array<Publication>;
    month: Array<Publication>;
    earlier: Array<Publication>;
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
        private userService: UserService
    ) {}

    ngOnInit() {
        this.uSub = this.userService.userData$
            .pipe(take(2))
            .subscribe((user) => {
                if (!user) {
                    return;
                }

                if (user.subscriptions && user.subscriptions.length) {
                    let publications: Publication[] = [];

                    // fetch publications
                    this.pubService
                        .getPublicationsFromSubs(user.subscriptions)
                        .pipe(
                            switchMap((pubs) => {
                                publications = pubs;

                                // fetch avatars
                                const usernames = pubs.map((p) => p.author);
                                return this.avatarService.getMinAvatars(
                                    usernames
                                );
                            }),
                            take(1)
                        )
                        .subscribe((avatars) => {
                            // assing avatars
                            publications.forEach((pub) => {
                                pub.authorAv = avatars.find(
                                    (a) => a.username === pub.author
                                ).avatar;
                            });

                            if (publications.length) {
                                this.noContent = false
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

    private sortByDate(publications: Publication[]): Publication[] {
        return publications.sort(
            (a, b) =>
                Date.parse(b.created.toString()) -
                Date.parse(a.created.toString())
        );
    }

    private sortToGroupsByDate(
        publications: Publication[]
    ): publicationsSortedByDate {
        const pSorted = [[], [], [], [], []];
        const now = new Date().getTime();

        for (let p of publications) {
            const published = p.modified
                ? new Date(p.modified).getTime()
                : new Date(p.created).getTime();
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
