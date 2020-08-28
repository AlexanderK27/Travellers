import { Component, OnInit, OnDestroy } from '@angular/core';
import { AvatarService } from 'src/app/shared/services/avatar.service';
import { PublicationService } from 'src/app/shared/services/publication.service';
import { SearchQueryParams } from './search/search.component';
import { Publication, MiniatureAvatar } from 'src/app/shared/interfaces';
import { Subscription } from 'rxjs';

interface PublicationList {
    params?: SearchQueryParams;
    heading: string;
    publications: Array<Publication>;
    ready: boolean;
}

// users will be able to modify categories in next updates
const categories: PublicationList[] = [
    {
        params: { filterBy: `filters/continent`, equalTo: 'Europe' },
        heading: 'Travel around Europe',
        publications: [],
        ready: false,
    },
    {
        params: { filterBy: `filters/duration`, equalTo: '2-3' },
        heading: 'Weekend trip',
        publications: [],
        ready: false,
    },
    {
        params: { filterBy: `filters/people`, equalTo: '2' },
        heading: 'For couples',
        publications: [],
        ready: false,
    },
    {
        params: { filterBy: `filters/country`, equalTo: 'Poland' },
        heading: 'Explore Poland',
        publications: [],
        ready: false,
    },
    {
        params: { filterBy: `filters/amountCities`, equalTo: '4-5' },
        heading: 'Visit as many places as you can',
        publications: [],
        ready: false,
    },
];

@Component({
    selector: 'app-home-page',
    templateUrl: './home-page.component.html',
    styleUrls: ['./home-page.component.scss'],
})
export class HomePageComponent implements OnInit, OnDestroy {
    avatars: MiniatureAvatar[];
    aSub: Subscription;
    loading = true;
    publications: Array<Publication>;
    pubSub: Subscription;

    pppublications: PublicationList[] = [...categories];

    constructor(
        private avatarService: AvatarService,
        private pubService: PublicationService
    ) {}

    ngOnInit(): void {
        this.pubSub = this.pubService.publications$.subscribe(
            (p) => (this.publications = p)
        );

        this.pubService.getTopPublications().subscribe((publications) => {
            const pubs = Object.values(publications).filter(
                (p) => p.published === true
            );

            const usernames = pubs.map((publication) => publication.author);

            this.aSub = this.avatarService
                .getMinAvatars(usernames)
                .subscribe((avatars) => {
                    pubs.forEach((publication) => {
                        publication.authorAv = avatars.find(
                            (a) => a.username === publication.author
                        ).avatar;
                    });

                    this.pubService.publications$.next(
                        pubs.sort((a, b) => {
                            return (
                                (b.likes ? b.likes : 0) -
                                (a.likes ? a.likes : 0)
                            );
                        })
                    );
                    this.loading = false;
                });
        });
    }

    search({ filterBy, equalTo }) {
        this.pubService
            .getPublications(filterBy, equalTo)
            .subscribe((publications: { key: Publication }) => {
                const pubs = Object.values(publications).filter(
                    (p) => p.published === true
                );
                const usernames = pubs.map((publication) => publication.author);

                const avatarSub = this.avatarService
                    .getMinAvatars(usernames)
                    .subscribe((avatars) => {
                        pubs.forEach((publication) => {
                            publication.authorAv = avatars.find(
                                (a) => a.username === publication.author
                            ).avatar;
                        });

                        this.pubService.publications$.next(
                            pubs.sort((a, b) => {
                                return (
                                    (b.likes ? b.likes : 0) -
                                    (a.likes ? a.likes : 0)
                                );
                            })
                        );

                        avatarSub.unsubscribe();
                    });
            });
    }

    ngOnDestroy() {
        this.aSub.unsubscribe();
        this.pubSub.unsubscribe();
    }
}
