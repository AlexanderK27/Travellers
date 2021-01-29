import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { Confirmation } from 'src/app/shared/interfaces';
import { AlertService } from 'src/app/shared/services/alert.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ClipboardService } from 'src/app/shared/services/clipboard.service';
import { IMyPostCard } from 'src/app/shared/services/post/post.interfaces';
import { PostService } from 'src/app/shared/services/post/post.service';

@Component({
    selector: 'app-my-post-card',
    templateUrl: './my-post-card.component.html',
    styleUrls: [
        './my-post-card.component.scss',
        '../../../../shared/styles/post-card.scss'
    ],
})
export class MyPostCardComponent {
    @Input() post: IMyPostCard;
    @Output() delete: EventEmitter<number> = new EventEmitter<number>();

    showPopupMenu = false;
    window: Confirmation = null;

    constructor(
        private alert: AlertService,
        private auth: AuthService,
        private clipboard: ClipboardService,
        private postService: PostService,
        private router: Router
    ) {}

    closeConfirmWindow() {
        this.window = null;
    }

    copyLink() {
        this.clipboard.copyCurrentURL(this.handlePopupMenu.bind(this));
    }

    deletePost() {
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
                    this.delete.emit(this.post.post_id);
                },
                () => {
                    this.alert.danger('Something went wrong, try again later');
                },
                () => {
                    this.window = null;
                }
            );
    }

    editPost() {
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

    publishPost(state: string) {
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

    savePost() {
        if (this.auth.isAuthenticated()) {
            this.post.isSaved = !this.post.isSaved;
            this.postService.saveOne(this.post.post_id);
        } else {
            this.alert.warning('Please authorize');
        }
    }
}
