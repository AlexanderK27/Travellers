import { Component, OnInit, OnDestroy } from '@angular/core';
import { AvatarService } from 'src/app/shared/services/avatar.service';
import { PublicationService } from 'src/app/shared/services/publication.service';
import { SearchQueryParams } from './search/search.component';
import { Publication, MiniatureAvatar } from 'src/app/shared/interfaces';
import { Subscription, forkJoin } from 'rxjs';
import { map, take } from 'rxjs/operators';

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
    categories: PublicationList[] = [...categories];

    constructor(
        private avatarService: AvatarService,
        private pubService: PublicationService
    ) {}

    ngOnInit(): void {
        let requests = [];
        for (const category of this.categories) {
            requests.push(
                this.pubService.getPublications(
                    category.params.filterBy,
                    category.params.equalTo
                )
            );
        }

        forkJoin<{ key: Publication }>(requests)
            .pipe(
                map((pubsList) => {
                    return pubsList.map((obj) =>
                        Object.values(obj).filter((p) => p.published)
                    );
                })
            )
            .subscribe((pubsListArray: Publication[][]) => {
                pubsListArray.forEach((pubsList, idx) => {
                    // get usernames of publications' authors
                    const usernames = pubsList.map(
                        (publication) => publication.author
                    );

                    // fetch small avatars
                    this.aSub = this.avatarService
                        .getMinAvatars(usernames)
                        .pipe(take(1))
                        .subscribe((avatars) => {
                            // insert avatar to each publication object
                            pubsList.forEach((publication) => {
                                publication.authorAv = avatars.find(
                                    (a) => a.username === publication.author
                                ).avatar;
                            });

                            // pass publications to categories
                            this.categories[idx].publications = [...pubsList];
                            this.categories[idx].ready = true;
                        });
                });
            });
    }

    search([queryParams, callback]) {
        const { equalTo, filterBy } = queryParams;
        const searchCategoryHeading = 'Search results';
        const emptySearchCategory = {
            heading: `Please wait...`,
            publications: [],
            ready: false,
        };

        if (this.categories[0].heading === searchCategoryHeading) {
            this.categories[0] = { ...emptySearchCategory };
        } else {
            this.categories.unshift({ ...emptySearchCategory });
        }

        this.pubService
            .getPublications(filterBy, equalTo)
            .subscribe((publications: { key: Publication }) => {
                const pubs = Object.values(publications)
                    .filter((p) => p.published === true)
                    .sort((a, b) => {
                        return (
                            (b.likes ? b.likes : 0) - (a.likes ? a.likes : 0)
                        );
                    });
                const usernames = pubs.map((publication) => publication.author);

                this.aSub = this.avatarService
                    .getMinAvatars(usernames)
                    .subscribe((avatars) => {
                        pubs.forEach((publication) => {
                            publication.authorAv = avatars.find(
                                (a) => a.username === publication.author
                            ).avatar;
                        });

                        this.categories[0] = {
                            ...this.categories[0],
                            heading: searchCategoryHeading,
                            publications: [...pubs],
                            ready: true,
                        };

                        callback();
                    });
            });
    }

    ngOnDestroy() {
        if (this.aSub) this.aSub.unsubscribe();
    }
}
