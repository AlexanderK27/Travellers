import { Component, OnInit, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Subscription, forkJoin } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { AvatarService } from 'src/app/shared/services/avatar.service';
import { PublicationService } from 'src/app/shared/services/post/post.service';
import { SearchQueryParams } from './search/search.component';
import { MiniatureAvatar } from 'src/app/shared/interfaces';
import { IPost } from 'src/app/shared/services/post/post.interfaces';

interface IPostList {
    params?: SearchQueryParams;
    heading: string;
    posts: IPost[];
    ready: boolean;
}

// users will be able to modify categories in next updates
const categories: IPostList[] = [
    {
        params: { filterBy: `filters/continent`, equalTo: 'Europe' },
        heading: 'Travel around Europe',
        posts: [],
        ready: false,
    },
    {
        params: { filterBy: `filters/duration`, equalTo: '2-3' },
        heading: 'Weekend trip',
        posts: [],
        ready: false,
    },
    {
        params: { filterBy: `filters/people`, equalTo: '2' },
        heading: 'For couples',
        posts: [],
        ready: false,
    },
    {
        params: { filterBy: `filters/country`, equalTo: 'Poland' },
        heading: 'Explore Poland',
        posts: [],
        ready: false,
    },
    {
        params: { filterBy: `filters/amountCities`, equalTo: '4-5' },
        heading: 'Visit as many places as you can',
        posts: [],
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
    categories: IPostList[] = [...categories];

    constructor(
        private avatarService: AvatarService,
        private pubService: PublicationService,
        private title: Title
    ) {}

    ngOnInit(): void {
        this.title.setTitle(
            'Travellers - An inexhaustible source of travel ideas'
        );

        let requests = [];
        for (const category of this.categories) {
            requests.push(
                this.pubService.getMany(
                    category.params.filterBy,
                    category.params.equalTo
                )
            );
        }

        forkJoin<{ key: IPost }>(requests)
            .pipe(
                map((pubsList) => {
                    return pubsList.map((obj) =>
                        Object.values(obj).filter((post) => post)
                    );
                })
            )
            .subscribe((pubsListArray: IPost[][]) => {
                pubsListArray.forEach((pubsList, idx) => {
                    // get usernames of publications' authors
                    const usernames = pubsList.map(
                        (publication) => publication.author_name
                    );

                    // fetch small avatars
                    this.aSub = this.avatarService
                        .getMinAvatars(usernames)
                        .pipe(take(1))
                        .subscribe((avatars) => {
                            // insert avatar to each publication object
                            pubsList.forEach((publication) => {
                                publication.author_avatar = avatars.find(
                                    (a) => a.username === publication.author_name
                                ).avatar;
                            });

                            // pass publications to categories
                            this.categories[idx].posts = [...pubsList];
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
            posts: [],
            ready: false,
        };

        if (this.categories[0].heading === searchCategoryHeading) {
            this.categories[0] = { ...emptySearchCategory };
        } else {
            this.categories.unshift({ ...emptySearchCategory });
        }

        this.pubService
            .getMany(filterBy, equalTo)
            .subscribe((publications: { key: IPost }) => {
                const pubs = Object.values(publications)
                    .filter((post) => post)
                    .sort((a, b) => {
                        return (
                            (b.likes ? b.likes : 0) - (a.likes ? a.likes : 0)
                        );
                    });
                const usernames = pubs.map((post) => post.author_name);

                this.aSub = this.avatarService
                    .getMinAvatars(usernames)
                    .subscribe((avatars) => {
                        pubs.forEach((publication) => {
                            publication.author_avatar = avatars.find(
                                (a) => a.username === publication.author_name
                            ).avatar;
                        });

                        this.categories[0] = {
                            ...this.categories[0],
                            heading: searchCategoryHeading,
                            posts: [...pubs],
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
