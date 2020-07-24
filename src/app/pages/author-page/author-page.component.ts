import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs';
import { switchMap, mergeMap } from 'rxjs/operators';
import { UserData, Publication } from 'src/app/shared/interfaces';
import { UserService } from 'src/app/shared/services/user.service';
import { PublicationService } from 'src/app/shared/services/publication.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { AlertService } from 'src/app/shared/services/alert.service';

@Component({
    selector: 'app-author-page',
    templateUrl: './author-page.component.html',
    styleUrls: ['./author-page.component.scss']
})
export class AuthorPageComponent implements OnInit, OnDestroy {
    author: UserData
    btnPressed = false
    loading = true
    publications: Array<Publication> = []
    pubSub: Subscription
    user: UserData = {userId: '', username: ''}
    userSub: Subscription

    constructor(
        private auth: AuthService,
        private alert: AlertService,
        private route: ActivatedRoute,
        private pubService: PublicationService,
        private userService: UserService
    ) {}

    ngOnInit(): void {
        this.pubSub = this.pubService.publications$.subscribe(pubs => {
            this.publications = pubs
        })
        // get user to know if user is subscribed on this author
        this.userSub = this.userService.userData$.subscribe(user => {
            if (user) this.user = user
        })
        // fetch author
        this.route.params.pipe(
            switchMap((params: Params) => this.userService.getAuthor(params.username)),
            mergeMap((response: {user: UserData}) => {
                const author = this.author = Object.values(response)[0]

                // fetch author's publications
                return this.pubService.getPublications('author', author.username)
            }),
        ).subscribe((pubs: {publication: Publication}) => {
            let publications = Object.values(pubs).filter(p => p.published === true).reverse()
            if (publications.length) {
                publications.forEach(pub => pub.authorAv = this.author.minAvatar)
                this.pubService.publications$.next(publications)
            }

            this.loading = false
        })
    }

    onSubscribe(state: boolean) {
        if (this.auth.isAuthenticated()) {
            this.btnPressed = true
            this.userService.subscribeOnAuthor(state, this.author.username, this.author.userId).subscribe(res => {
                this.author.subscribers = res.subscribers
            }, () => {}, () => {
                this.btnPressed = false
            })
        } else {
            this.alert.warning('Please authorize')
        }
    }

    ngOnDestroy(): void {
        this.pubSub.unsubscribe()
        this.userSub.unsubscribe()
    }
}
