import { Component, OnInit, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Subscription } from 'rxjs';

import { UserData, Publication } from 'src/app/shared/interfaces';
import { UserService } from 'src/app/shared/services/user.service';
import { PublicationService } from 'src/app/shared/services/publication.service';

@Component({
    selector: 'app-profile-page',
    templateUrl: './profile-page.component.html',
    styleUrls: ['./profile-page.component.scss'],
})
export class ProfilePageComponent implements OnInit, OnDestroy {
    loading = true;
    publications: Array<Publication> = [];
    user: UserData;
    userSub: Subscription;

    constructor(
        private userService: UserService,
        private pubService: PublicationService,
        private title: Title
    ) {}

    ngOnInit(): void {
        this.userSub = this.userService.userData$.subscribe((user) => {
            if (user) {
                this.user = user;

                this.title.setTitle(
                    `${user.username} | User Profile • Travellers`
                );

                this.pubService
                    .getPublications('authorId', user.userId)
                    .subscribe((pubs: { publication: Publication }) => {
                        const publications = Object.values(pubs);

                        publications.forEach(
                            (p) => (p.authorAv = user.minAvatar)
                        );

                        this.publications = publications.sort((a, b) => {
                            return (
                                Date.parse(b.created.toString()) -
                                Date.parse(a.created.toString())
                            );
                        });

                        this.loading = false;
                    });
            }
        });
    }

    deletePublication(id: string) {
        this.userService.userData$.next({
            ...this.user,
            publications: this.user.publications - 1,
        });
        this.publications = this.publications.filter((pub) => pub.link !== id);
    }

    ngOnDestroy() {
        this.userSub.unsubscribe();
    }
}
