import { Component, OnInit, Input} from '@angular/core';
import { Router } from '@angular/router';
import { PostService } from '../../services/post/post.service';
import { AlertService } from '../../services/alert.service';
import { AuthService } from '../../services/auth/auth.service';
import { ClipboardService } from '../../services/clipboard.service';
import { IPostCard } from '../../services/post/post.interfaces';

@Component({
    selector: 'app-post-card',
    templateUrl: './post-card.component.html',
    styleUrls: ['./post-card.component.scss', '../../styles/post-card.scss'],
})
export class PostCardComponent implements OnInit {
    @Input() markUpdated = false;
    @Input() post: IPostCard;
    avatarSrc = '../../../../assets/avatar.jpg';
    posterSrc = '../../../../assets/article_poster.jpg';

    showPopupMenu = false;

    constructor(
        private alert: AlertService,
        private auth: AuthService,
        private clipboard: ClipboardService,
        private postService: PostService,
        private router: Router
    ) {}

    ngOnInit() {
        if (this.post.author_avatar) {
            this.avatarSrc = '/api/image/avatar-min/' + this.post.author_avatar;
        }
        if (this.post.poster) {
            this.posterSrc = '/api/image/poster/' + this.post.poster;
        }
    }

    copyLink() {
        this.clipboard.copyCurrentURL(this.handlePopupMenu.bind(this));
    }

    handlePopupMenu() {
        this.showPopupMenu = !this.showPopupMenu;
    }

    navigateToComments() {
        this.router.navigate(['/post', this.post.post_id], {
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
