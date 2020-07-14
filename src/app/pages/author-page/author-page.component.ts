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
    publications: Array<Publication>
    pubSub: Subscription
    user: UserData
    userSub: Subscription

    constructor(
        private auth: AuthService,
        private alert: AlertService,
        private route: ActivatedRoute,
        private pubService: PublicationService,
        private userService: UserService
    ) {
        this.pubSub = this.pubService.publications$.subscribe(pubs => {
            this.publications = pubs
        })
        this.userSub = this.userService.userData$.subscribe(user => {
            user ? this.user = user : this.user = {
                userId: '',
                username: ''
            }
        })
    }

    ngOnInit(): void {
        this.pubService.publications$.next([])
        this.route.params.pipe(
            switchMap((params: Params) => this.userService.getAuthor(params.username)),
            mergeMap((response: {key: UserData}) => {
                const author = Object.values(response)[0]
                this.author = author
                return this.pubService.getAuthorPublications(author.username)
            })
        ).subscribe(pubs => this.pubService.publications$.next(Object.values(pubs)))
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
