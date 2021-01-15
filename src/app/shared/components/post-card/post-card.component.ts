import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { Confirmation } from '../../interfaces';
import { PostService } from '../../services/post/post.service';
import { AlertService } from '../../services/alert.service';
import { AuthService } from '../../services/auth.service';
// import { UserService } from '../../services/user/user.service';
// import { take } from 'rxjs/operators';
import { IPostCard } from '../../services/post/post.interfaces';

@Component({
    selector: 'app-post-card',
    templateUrl: './post-card.component.html',
    styleUrls: ['./post-card.component.scss'],
})
export class PostCardComponent implements OnInit {
    @Input() isAuthor = false;
    @Input() markUpdated = false;
    @Input() post: IPostCard;
    @Output() onDelete: EventEmitter<number> = new EventEmitter<number>();
    croppedImageSize = [{ width: 480, height: 360 }];
    croppedImageRatio = 4 / 3;
    isSaved = false;
    showPopupMenu = false;
    window: Confirmation = null;

    constructor(
        private alert: AlertService,
        private auth: AuthService,
        // private userService: UserService,
        private postService: PostService,
        private router: Router
    ) {}

    ngOnInit() {
        // this.userService.userData$.pipe(take(2)).subscribe((user) => {
        //     if (user) {
                // this.isSaved = (user.saved || []).includes(this.plan.post_id);
            // }
        // });
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
        this.postService
            .deleteOne(this.post.post_id)
            .subscribe(
                () => {
                    this.alert.success('Publication has been deleted');
                    this.onDelete.emit(this.post.post_id);
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
        this.router.navigate(['/profile', 'edit', this.post.post_id]);
    }

    handlePopupMenu() {
        this.showPopupMenu = !this.showPopupMenu;
    }

    navigateToComments() {
        this.router.navigate(['/publication', this.post.post_id], {
            fragment: 'comments',
        });
    }

    publishArticle(state: string) {
        this.postService
            .changeStatus(this.post.post_id, state)
            // .subscribe(() => {
            //     this.plan.post_status = state;
            //     if (state) {
            //         this.alert.success(
            //             'Now your post will appear in search results'
            //         );
            //     } else
            //         [
            //             this.alert.success(
            //                 'Your publication has been hidden from search engine'
            //             ),
            //         ];
            // });
    }

    saveArticle() {
        if (this.auth.isAuthenticated()) {
            this.isSaved = !this.isSaved;
            this.postService.saveOne(this.post.post_id);
        } else {
            this.alert.warning('Please authorize');
        }
    }
}
