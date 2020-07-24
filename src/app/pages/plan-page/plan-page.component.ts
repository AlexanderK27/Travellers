import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { PublicationService } from 'src/app/shared/services/publication.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { Comment, Publication } from 'src/app/shared/interfaces';
import { CommentService } from 'src/app/shared/services/comment.service';
import { mergeMap } from 'rxjs/operators';
import { AvatarService } from 'src/app/shared/services/avatar.service';

@Component({
    selector: 'app-plan-page',
    templateUrl: './plan-page.component.html',
    styleUrls: ['./plan-page.component.scss']
})
export class PlanPageComponent implements OnInit {
    commentText = ''
    comments: Array<Comment> = []
    loading = true
    showGetCommentsBtn = true
    submitted = false
    publication: Publication

    constructor(
        public auth: AuthService,
        private avatarService: AvatarService,
        private commentService: CommentService,
        private pubService: PublicationService,
        private route: ActivatedRoute
    ) { }

    // get publication and author's avatar
    // check fragment if user came by pressing 'comment' icon
    // if so - get and display comments
    ngOnInit(): void {
        this.route.params.pipe(
            mergeMap((params: Params) => this.pubService.getPublication(params.title)),
            mergeMap(publication => {
                this.publication = publication
                return this.avatarService.getMinAvatars([publication.author])
            }),
            mergeMap(avatarArr => {
                this.publication.authorAv = avatarArr[0].avatar
                return this.route.fragment
            })
        ).subscribe(fragment => {
            if (fragment === 'comments') {
                this.fetchComments()
            }
            this.loading = false
        })
    }

    addEmoji({ emoji }) {
        this.commentText = this.commentText + emoji.native
    }

    autoResize(event) {
        event.target.style.height = "0px"
        event.target.style.height = (event.target.scrollHeight + 16) + "px"
    }

    fetchComments() {
        this.submitted = true
        this.commentService.getComments(this.publication.link)
            .subscribe((comments: {key: Comment} | null) => {
                this.showGetCommentsBtn = false
                this.submitted = false
                if (comments) {
                    const commentsArray = Object.values(comments)

                    // get avatar for each comment
                    const commentators = commentsArray.map(c => c.username)
                    this.avatarService.getMinAvatars(commentators).subscribe(avatars => {
                        commentsArray.forEach(c => {
                            c.userAv = avatars.find(a => a.username === c.username).avatar
                        })
                    })

                    // parse answers for each comment
                    const ids = Object.keys(comments)
                    commentsArray.forEach((comment, idx) => {
                        comment.id = ids[idx]
                        if (comment.answers) {
                            comment.answers = Object.values(comment.answers)

                            // get avatar for each answer
                            const usernames = comment.answers.map(a => a.username)
                            this.avatarService.getMinAvatars(usernames).subscribe(avatars => {
                                comment.answers.forEach(answ => {
                                    answ.userAv = avatars.find(a => a.username === answ.username).avatar
                                })
                            })
                        }
                    })
                    this.comments = commentsArray.sort(() => -1)
                } else {
                    this.comments = []
                }
            }, () => {
                this.submitted = false
            }
        )
    }

    cancelCommenting() {
        this.commentText = ''
    }

    saveAnswer({ commentId, text, onSuccess, onError }) {
        if (text && this.auth.isAuthenticated()) {
            this.submitted = true
            this.commentService.commentPublication(this.publication.link, text, commentId).subscribe(() => {
                onSuccess()
                this.fetchComments()
            }, () => {
                onError()
            })
        }
    }

    saveComment() {
        if (this.commentText && this.auth.isAuthenticated()) {
            this.submitted = true
            this.commentService.commentPublication(this.publication.link, this.commentText).subscribe(() => {
                this.commentText = ''
                this.fetchComments()
            }, () => {
                this.submitted = false
            })
        }
    }
}
