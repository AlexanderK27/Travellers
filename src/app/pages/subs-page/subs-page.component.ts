import { Component, OnInit, OnDestroy } from '@angular/core';
import { PlanCard } from 'src/app/shared/interfaces';
import { PublicationService } from 'src/app/shared/services/publication.service';
import { UserService } from 'src/app/shared/services/user.service';
import { Subscription } from 'rxjs';
import { AvatarService } from 'src/app/shared/services/avatar.service';

interface publicationsSortedByDate {
    today: Array<PlanCard>
    yesterday: Array<PlanCard>
    week: Array<PlanCard>
    month: Array<PlanCard>
    earlier: Array<PlanCard>
}

@Component({
    selector: 'app-subs-page',
    templateUrl: './subs-page.component.html',
    styleUrls: ['./subs-page.component.scss']
})
export class SubsPageComponent implements OnInit, OnDestroy {
    aSub: Subscription
    loading = true
    publications: publicationsSortedByDate = {
        today: [],
        yesterday: [],
        week: [],
        month: [],
        earlier: []
    }
    pSub: Subscription
    uSub: Subscription

    constructor(
        private avatarService: AvatarService,
        private pubService: PublicationService,
        private userService: UserService
    ) {}

    ngOnInit(): void {
        this.pSub = this.pubService.publications$.subscribe(publications => {
            if (!publications.length) {
                return
            }
            const pSorted = [[], [], [], [], []]
            const now = new Date().getTime()
            for (let p of publications) {
                const published = p.modified ? new Date(p.modified).getTime() : new Date(p.created).getTime()
                const timePassed = now - published
                if (timePassed <= 24 * 3600000) {
                    pSorted[0].unshift(p)
                } else if (timePassed <= 48 * 3600000) {
                    pSorted[1].unshift(p)
                } else if (timePassed <= 7 * 24 * 3600000) {
                    pSorted[2].unshift(p)
                } else if (timePassed <= 30 * 24 * 3600000) {
                    pSorted[3].unshift(p)
                } else {
                    pSorted[4].unshift(p)
                }
            }

            this.publications = {
                today: [...pSorted[0]],
                yesterday: [...pSorted[1]],
                week: [...pSorted[2]],
                month: [...pSorted[3]],
                earlier: [...pSorted[4]]
            }
        })
        this.uSub = this.userService.userData$.subscribe(user => {
            if (user) {
                if (user.subscriptions && user.subscriptions.length) {
                    this.pubService.getPublicationsFromSubs(user.subscriptions).subscribe(publications => {
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
        if (this.aSub) this.aSub.unsubscribe()
        this.pSub.unsubscribe()
        this.uSub.unsubscribe()
    }
}
