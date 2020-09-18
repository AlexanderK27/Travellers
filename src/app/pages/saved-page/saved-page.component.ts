import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';
import { Publication } from 'src/app/shared/interfaces';
import { AvatarService } from 'src/app/shared/services/avatar.service';
import { PublicationService } from 'src/app/shared/services/publication.service';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
    selector: 'app-saved-page',
    templateUrl: './saved-page.component.html',
    styleUrls: ['./saved-page.component.scss'],
})
export class SavedPageComponent implements OnInit, OnDestroy {
    loading = true;
    publications: Array<Publication> = [];
    uSub: Subscription;

    constructor(
        private avatarService: AvatarService,
        private pubService: PublicationService,
        private userService: UserService
    ) {}

    ngOnInit(): void {
        this.uSub = this.userService.userData$
            .pipe(take(2))
            .subscribe((user) => {
                if (user) {
                    // check if user has saved publications and then stop loading
                    if (user.saved && user.saved.length) {
                        let publications = [];

                        this.pubService
                            .getSavedPublications(user.saved)
                            .pipe(
                                // the array includes null if any publication has been deleted
                                // filter to avoid it
                                map((pubs) => pubs.filter((p) => !!p)),
                                switchMap((pubs) => {
                                    publications = [...pubs];

                                    // get avatars of each author
                                    const usernames = pubs.map((p) => p.author);
                                    return this.avatarService.getMinAvatars(
                                        usernames
                                    );
                                }),
                                take(1)
                            )
                            .subscribe((avatars) => {
                                // assign appropriate avatar to each publication
                                this.publications = publications.map((p) => {
                                    p.authorAv = avatars.find((a) => {
                                        return a.username === p.author;
                                    }).avatar;

                                    return p;
                                });

                                this.loading = false;
                            });
                    } else {
                        this.loading = false;
                    }
                }
            });
    }

    ngOnDestroy(): void {
        this.uSub.unsubscribe();
    }
}
