import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { switchMap, take } from 'rxjs/operators';
import { throwError } from 'rxjs';

import { PublicationService } from 'src/app/shared/services/publication.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { Comment, Publication } from 'src/app/shared/interfaces';
import { CommentService } from 'src/app/pages/plan-page/comment/comment.service';
import { AvatarService } from 'src/app/shared/services/avatar.service';
import { UserService } from 'src/app/shared/services/user.service';
import { AlertService } from 'src/app/shared/services/alert.service';

interface ArticleActions {
    disliked: boolean;
    liked: boolean;
    saved: boolean;
}

@Component({
    selector: 'app-plan-page',
    templateUrl: './plan-page.component.html',
    styleUrls: ['./plan-page.component.scss'],
    providers: [CommentService],
})
export class PlanPageComponent implements OnInit {
    @ViewChild('commentTextarea') cTextareaRef: ElementRef;
    isAuthenticated = false;
    commentText = '';
    comments: Array<Comment> = [];
    likeDifference: number;
    loading = true;
    showEmojis = false;
    showGetCommentsBtn = true;
    submitted = false;
    publication: Publication;
    publicationState: ArticleActions = {
        disliked: false,
        liked: false,
        saved: false,
    };

    constructor(
        private alert: AlertService,
        private auth: AuthService,
        private avatarService: AvatarService,
        private commentService: CommentService,
        private pubService: PublicationService,
        private route: ActivatedRoute,
        private router: Router,
        private user: UserService,
        private title: Title
    ) {}

    ngOnInit() {
        this.route.params
            .pipe(
                // fetch publication
                switchMap((params: Params) =>
                    this.pubService.getPublication(params.title)
                ),
                switchMap((publication) => {
                    if (!publication) {
                        return throwError(404);
                    }

                    this.setTitle(publication.title);

                    this.publication = {
                        ...publication,
                        likes: publication.likes || 0,
                        dislikes: publication.dislikes || 0,
                    };
                    this.likeDifference =
                        this.publication.likes - this.publication.dislikes;

                    // get author's avatar
                    return this.avatarService.getMinAvatars([
                        publication.author,
                    ]);
                }),
                switchMap((avatarArr) => {
                    this.publication.authorAv = avatarArr[0].avatar;

                    // check if user came for comments
                    return this.route.fragment;
                })
            )
            .subscribe(
                (fragment) => {
                    if (fragment === 'comments') {
                        // get and display comments
                        this.fetchComments();
                    }

                    // check if user is authenticated
                    this.isAuthenticated = this.auth.isAuthenticated();

                    // check did user like, dislike or save this article
                    if (this.isAuthenticated) {
                        this.user.userData$.pipe(take(1)).subscribe((user) => {
                            this.publicationState = {
                                disliked: (user.disliked || []).includes(
                                    this.publication.link
                                ),
                                liked: (user.liked || []).includes(
                                    this.publication.link
                                ),
                                saved: (user.saved || []).includes(
                                    this.publication.link
                                ),
                            };

                            this.loading = false;
                        });
                    } else {
                        this.loading = false;
                    }
                },
                (e) => {
                    if (e === 404) {
                        this.alert.danger('Publication not found');
                    } else {
                        this.alert.danger('Unkown error');
                    }
                    this.router.navigate(['/']);
                }
            );
    }

    addEmoji({ emoji }) {
        this.commentText = this.commentText + emoji.native;
    }

    autoResize(event: Event) {
        event.target['style'].height = '0px';
        event.target['style'].height = event.target['scrollHeight'] + 16 + 'px';
    }

    cancelCommenting() {
        this.commentText = '';
    }

    copyLinkToClipboard() {
        navigator.clipboard
            .writeText(document.location.href)
            .then(() => {
                this.alert.success('Link copied to clipboard');
            })
            .catch(() => {
                this.alert.danger('Failed to copy a link');
            });
    }

    dislikeArticle() {
        if (!this.isAuthenticated) {
            return this.alert.warning('Please sign in');
        }

        const newState = !this.publicationState.disliked;
        this.publicationState.disliked = newState;

        if (newState) {
            this.publication.dislikes = this.publication.dislikes + 1;

            if (this.publicationState.liked) {
                this.publicationState.liked = false;
                this.publication.likes = this.publication.likes - 1;
            }
        } else {
            this.publication.dislikes = this.publication.dislikes - 1;
        }
        this.likeDifference =
            this.publication.likes - this.publication.dislikes;

        this.pubService.dislikePublication(this.publication.link);
    }

    emojiPickerStateHandler() {
        this.showEmojis = !this.showEmojis;
    }

    fetchComments() {
        this.submitted = true;
        this.commentService.getComments(this.publication.link).subscribe(
            (comments: { key: Comment } | null) => {
                this.showGetCommentsBtn = false;
                this.submitted = false;
                if (comments) {
                    const commentsArray = Object.values(comments);

                    // get avatar for each comment
                    const commentators = commentsArray.map((c) => c.username);
                    this.avatarService
                        .getMinAvatars(commentators)
                        .subscribe((avatars) => {
                            commentsArray.forEach((c) => {
                                c.userAv = avatars.find(
                                    (a) => a.username === c.username
                                ).avatar;
                            });
                        });

                    // parse answers for each comment
                    const ids = Object.keys(comments);
                    commentsArray.forEach((comment, idx) => {
                        comment.id = ids[idx];
                        if (comment.answers) {
                            comment.answers = Object.values(comment.answers);

                            // get avatar for each answer
                            const usernames = comment.answers.map(
                                (a) => a.username
                            );
                            this.avatarService
                                .getMinAvatars(usernames)
                                .subscribe((avatars) => {
                                    comment.answers.forEach((answ) => {
                                        answ.userAv = avatars.find(
                                            (a) => a.username === answ.username
                                        ).avatar;
                                    });
                                });
                        }
                    });
                    this.comments = [...commentsArray.reverse()];
                } else {
                    this.comments = [];
                }
            },
            () => {
                this.submitted = false;
            }
        );
    }

    focusOnCommentTextarea() {
        this.cTextareaRef.nativeElement.focus();
    }

    likeArticle() {
        if (!this.isAuthenticated) {
            return this.alert.warning('Please sign in');
        }

        const newState = !this.publicationState.liked;
        this.publicationState.liked = newState;

        if (newState) {
            this.publication.likes = this.publication.likes + 1;

            if (this.publicationState.disliked) {
                this.publicationState.disliked = false;
                this.publication.dislikes = this.publication.dislikes - 1;
            }
        } else {
            this.publication.likes = this.publication.likes - 1;
        }
        this.likeDifference =
            this.publication.likes - this.publication.dislikes;

        this.pubService.likePublication(this.publication.link);
    }

    saveAnswer({ commentId, text, onSuccess, onError }) {
        if (text && this.auth.isAuthenticated()) {
            this.submitted = true;
            this.commentService
                .commentPublication(this.publication.link, text, commentId)
                .subscribe(
                    () => {
                        onSuccess();
                        this.fetchComments();
                    },
                    () => {
                        onError();
                    }
                );
        }
    }

    saveArticle() {
        if (this.isAuthenticated) {
            this.publicationState.saved = !this.publicationState.saved;
            this.pubService.savePublication(this.publication.link, false);
        } else {
            this.alert.warning('Please sign in');
        }
    }

    saveComment() {
        if (this.commentText && this.auth.isAuthenticated()) {
            this.submitted = true;
            this.commentService
                .commentPublication(this.publication.link, this.commentText)
                .subscribe(
                    () => {
                        this.commentText = '';
                        this.fetchComments();
                    },
                    () => {
                        this.submitted = false;
                    }
                );
        }
    }

    private setTitle(title: string) {
        if (title.length > 50) {
            title = title.trim().substring(0, 50) + '... ';
        }

        this.title.setTitle(title + ' • Travellers');
    }
}
