import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { PlanCard, Confirmation, UserData } from '../../interfaces';
import { Router } from '@angular/router';
import { PublicationService } from '../../services/publication.service';
import { AlertService } from '../../services/alert.service';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';

@Component({
    selector: 'app-plan-card',
    templateUrl: './plan-card.component.html',
    styleUrls: ['./plan-card.component.scss']
})
export class PlanCardComponent implements OnInit {
    @Input() plan: PlanCard
    @Input() isAuthor = false
    @Input() savedPage = false
    @Output() deletePub: EventEmitter<string> = new EventEmitter<string>()
    user: UserData
    window: Confirmation = null

    constructor(
        private alert: AlertService,
        private auth: AuthService,
        private userService: UserService,
        private pubService: PublicationService,
        private router: Router
    ) {
        this.userService.userData$.subscribe(user => {
            this.user = {
                ...user,
                disliked: user.disliked || [],
                liked: user.liked || [],
                saved: user.saved || []
            }
        })
    }

    ngOnInit(): void {
    }

    deletePublication() {
        this.pubService.deletePublication(this.plan.authorId, this.plan.link).subscribe(() => {
            this.alert.success('Publication has been deleted')
            this.deletePub.emit(this.plan.link)
        }, () => {
            this.alert.danger('Something went wrong, try again later')
        }, () => {
            this.window = null
        })
    }

    onCloseWindow(_: any) {
        this.window = null
    }

    onEdit() {
        this.router.navigate(['/profile', 'edit', this.plan.link])
    }

    onDelete() {
        this.window = {
            text: 'Are you sure you want to delete this publication?',
            confirmButtonTitle: 'Delete',
            callback: this.deletePublication.bind(this)
        }
    }

    onDislike() {
        if(this.auth.isAuthenticated()) {
            this.pubService.dislikePublication(this.plan.link)
        } else {
            this.alert.warning('Please authorize')
        }
    }

    onLike() {
        if(this.auth.isAuthenticated()) {
            this.pubService.likePublication(this.plan.link)
        } else {
            this.alert.warning('Please authorize')
        }
    }

    onOpenComments() {
        this.router.navigate(['/plan', this.plan.link], {
            fragment: '#comments'
        })
    }

    onPublish(state: boolean) {
        this.pubService.publishPublication(this.plan.link, state).subscribe(() => {
            this.plan.published = state
            if (state) {
                this.alert.success('Your publication is open for everyone now')
            } else [
                this.alert.success('Your publication has been hidden from search engine')
            ]
        })
    }

    onSave() {
        if(this.auth.isAuthenticated()) {
            this.pubService.savePublication(this.plan.link, this.savedPage)
        } else {
            this.alert.warning('Please authorize')
        }
    }
}
