import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { UserData, Publication } from 'src/app/shared/interfaces';
import { UserService } from 'src/app/shared/services/user.service';
import { PublicationService } from 'src/app/shared/services/publication.service';

@Component({
    selector: 'app-profile-page',
    templateUrl: './profile-page.component.html',
    styleUrls: ['./profile-page.component.scss']
})
export class ProfilePageComponent implements OnInit, OnDestroy {
    loading = true
    publications: Array<Publication> = []
    pubSub: Subscription
    user: UserData
    userSub: Subscription

    constructor(
        private userService: UserService,
        private pubService: PublicationService
    ) {}

    ngOnInit(): void {
        this.pubSub = this.pubService.publications$.subscribe(publications => {
            this.publications = publications
        })
        this.userSub = this.userService.userData$.subscribe(user => {
            if (user) {
                this.user = user

                this.pubService.getPublications("authorId", user.userId)
                    .subscribe((pubs: {publication: Publication}) => {
                        const publications = Object.values(pubs)

                        publications.forEach(p => p.authorAv = user.minAvatar)

                        this.pubService.publications$.next(publications.reverse())
                        this.loading = false
                    })
            }
        })
    }

    onDeletePublication(id: string) {
        this.publications = this.publications.filter(pub => pub.link !== id)
    }

    ngOnDestroy() {
        this.pubSub.unsubscribe()
        this.userSub.unsubscribe()
    }
}
