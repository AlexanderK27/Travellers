import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Publication } from 'src/app/shared/interfaces';
import { AvatarService } from 'src/app/shared/services/avatar.service';
import { PublicationService } from 'src/app/shared/services/publication.service';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
    selector: 'app-saved-page',
    templateUrl: './saved-page.component.html',
    styleUrls: ['./saved-page.component.scss']
})
export class SavedPageComponent implements OnInit, OnDestroy {
    aSub: Subscription
    loading = true
    publications: Array<Publication> = []
    pubSub: Subscription
    uSub: Subscription

    constructor(
        private avatarService: AvatarService,
        private pubService: PublicationService,
        private userService: UserService
    ) {}

    ngOnInit(): void {
        this.pubSub = this.pubService.publications$.subscribe(pubs => {
            this.publications = pubs
        })
        this.uSub = this.userService.userData$.subscribe(user => {
            if (user) {
                if (user.saved && user.saved.length) {
                    this.pubService.getSavedPublications(user.saved).subscribe(publications => {
                        const usernames = publications.map(p => p.author)

                        this.aSub = this.avatarService.getMinAvatars(usernames).subscribe(avatars => {
                            publications.forEach(pub => {
                                pub.authorAv = avatars.find(a => a.username === pub.author).avatar
                            })

                            this.pubService.publications$.next(publications)
                            this.loading = false
                        })
                    })
                } else {
                    this.pubService.publications$.next([])
                    this.loading = false
                }
            }
        })
    }

    ngOnDestroy(): void {
        this.pubSub.unsubscribe()
        this.uSub.unsubscribe()
    }
}
