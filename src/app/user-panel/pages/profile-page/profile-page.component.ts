import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService } from 'src/app/shared/services/user.service';
import { Subscription } from 'rxjs';
import { UserData, Publication } from 'src/app/shared/interfaces';
import { PublicationService } from 'src/app/shared/services/publication.service';

@Component({
    selector: 'app-profile-page',
    templateUrl: './profile-page.component.html',
    styleUrls: ['./profile-page.component.scss']
})
export class ProfilePageComponent implements OnInit, OnDestroy {
    publications: Array<Publication> = []
    pubSub: Subscription
    user: UserData
    userSub: Subscription

    constructor(
        private userService: UserService,
        private pubService: PublicationService
    ) {
        this.userSub = this.userService.userData$.subscribe(user => {
            this.user = user
        })
        this.pubSub = this.pubService.publications$.subscribe(publications => {
            this.publications = publications
        })
    }

    ngOnInit(): void {
        this.pubService.getMyPublications().subscribe(pubs => {
            const posts: Array<Publication> = Object.values(pubs)
            const links = Object.keys(pubs)
            const publications = posts.map((post, idx) => ({...post, link: links[idx]}))
            this.pubService.publications$.next(publications)
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
