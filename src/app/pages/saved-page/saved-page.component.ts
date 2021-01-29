import { Component, OnInit, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';

import { AvatarService } from 'src/app/shared/services/avatar.service';
import { IPost } from 'src/app/shared/services/post/post.interfaces';
import { PublicationService } from 'src/app/shared/services/post/post.service';
import { UserService } from 'src/app/shared/services/user/user.service';

@Component({
    selector: 'app-saved-page',
    templateUrl: './saved-page.component.html',
    styleUrls: ['./saved-page.component.scss'],
})
export class SavedPageComponent implements OnInit, OnDestroy {
    loading = true;
    publications: IPost[] = [];
    uSub: Subscription;

    constructor(
        private avatarService: AvatarService,
        private pubService: PublicationService,
        private userService: UserService,
        private title: Title
    ) {}

    ngOnInit(): void {
        this.title.setTitle('Saved • Travellers');

        this.uSub = this.userService.userData$
            .pipe(take(2))
            .subscribe((user) => {
                if (user) {
                    // check if user has saved publications and then stop loading
                    if (user.saved_posts && user.saved_posts.length) {
                        let publications = [];

                        this.pubService
                            .getSaved(user.saved_posts)
                            .pipe(
                                // the array includes null if any publication has been deleted
                                // filter to avoid it
                                map((pubs) => pubs.filter((p) => !!p)),
                                switchMap((pubs) => {
                                    publications = [...pubs];

                                    // get avatars of each author
                                    const usernames = pubs.map((p) => p.author_name);
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
