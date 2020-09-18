import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { PlanCard, Confirmation } from '../../interfaces';
import { PublicationService } from '../../services/publication.service';
import { AlertService } from '../../services/alert.service';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { take } from 'rxjs/operators';

@Component({
    selector: 'app-plan-card',
    templateUrl: './plan-card.component.html',
    styleUrls: ['./plan-card.component.scss'],
})
export class PlanCardComponent implements OnInit {
    @Input() isAuthor = false;
    @Input() markUpdated = false;
    @Input() plan: PlanCard;
    @Output() onDelete: EventEmitter<string> = new EventEmitter<string>();
    croppedImageSize = [{ width: 480, height: 360 }];
    croppedImageRatio = 4 / 3;
    isSaved = false;
    showPopupMenu = false;
    window: Confirmation = null;

    constructor(
        private alert: AlertService,
        private auth: AuthService,
        private userService: UserService,
        private pubService: PublicationService,
        private router: Router
    ) {}

    ngOnInit() {
        this.userService.userData$.pipe(take(2)).subscribe((user) => {
            if (user) {
                this.isSaved = (user.saved || []).includes(this.plan.link);
            }
        });
    }

    closeConfirmWindow() {
        this.window = null;
    }

    copyLink() {
        navigator.clipboard
            .writeText(document.location.href)
            .then(() => {
                this.alert.success('Link copied to clipboard');
            })
            .catch(() => {
                this.alert.danger('Failed to copy a link');
            })
            .finally(() => {
                this.handlePopupMenu();
            });
    }

    deleteArticle() {
        this.window = {
            text: 'Are you sure you want to delete this publication?',
            confirmButtonTitle: 'Delete',
            callback: this.deleteCallback.bind(this),
        };
    }

    deleteCallback() {
        this.pubService
            .deletePublication(this.plan.authorId, this.plan.link)
            .subscribe(
                () => {
                    this.alert.success('Publication has been deleted');
                    this.onDelete.emit(this.plan.link);
                },
                () => {
                    this.alert.danger('Something went wrong, try again later');
                },
                () => {
                    this.window = null;
                }
            );
    }

    editArticle() {
        this.router.navigate(['/profile', 'edit', this.plan.link]);
    }

    handlePopupMenu() {
        this.showPopupMenu = !this.showPopupMenu;
    }

    navigateToComments() {
        this.router.navigate(['/plan', this.plan.link], {
            fragment: 'comments',
        });
    }

    publishArticle(state: boolean) {
        this.pubService
            .publishPublication(this.plan.link, state)
            .subscribe(() => {
                this.plan.published = state;
                if (state) {
                    this.alert.success(
                        'Your publication is open for everyone now'
                    );
                } else
                    [
                        this.alert.success(
                            'Your publication has been hidden from search engine'
                        ),
                    ];
            });
    }

    saveArticle() {
        if (this.auth.isAuthenticated()) {
            this.isSaved = !this.isSaved;
            this.pubService.savePublication(this.plan.link);
        } else {
            this.alert.warning('Please authorize');
        }
    }
}
