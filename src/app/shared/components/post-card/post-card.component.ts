import { Component, Input} from '@angular/core';
import { Router } from '@angular/router';
import { PostService } from '../../services/post/post.service';
import { AlertService } from '../../services/alert.service';
import { AuthService } from '../../services/auth.service';
import { ClipboardService } from '../../services/clipboard.service';
import { IPostCard } from '../../services/post/post.interfaces';

@Component({
    selector: 'app-post-card',
    templateUrl: './post-card.component.html',
    styleUrls: ['./post-card.component.scss', '../../styles/post-card.scss'],
})
export class PostCardComponent {
    @Input() markUpdated = false;
    @Input() post: IPostCard;

    showPopupMenu = false;

    constructor(
        private alert: AlertService,
        private auth: AuthService,
        private clipboard: ClipboardService,
        private postService: PostService,
        private router: Router
    ) {}

    copyLink() {
        this.clipboard.copyCurrentURL(this.handlePopupMenu.bind(this));
    }

    handlePopupMenu() {
        this.showPopupMenu = !this.showPopupMenu;
    }

    navigateToComments() {
        this.router.navigate(['/publication', this.post.post_id], {
            fragment: 'comments',
        });
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
