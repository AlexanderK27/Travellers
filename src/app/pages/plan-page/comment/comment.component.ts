import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Comment } from 'src/app/shared/interfaces';

@Component({
    selector: 'app-comment',
    templateUrl: './comment.component.html',
    styleUrls: ['./comment.component.scss']
})
export class CommentComponent {
    @Input() comment: Comment
    @Output() onAddAnswer: EventEmitter<{
        commentId: string,
        text: string
        onSuccess: Function,
        onError: Function
    }> = new EventEmitter()
    answerText = ''
    showAnswers = false
    showForm = false
    submitted = false

    constructor() { }

    addEmoji({ emoji }) {
        this.answerText = this.answerText + emoji.native
    }

    autoResize(event) {
        event.target.style.height = "0px"
        event.target.style.height = (event.target.scrollHeight + 16) + "px"
    }

    cancelAnswering() {
        this.answerText = ''
        this.showForm = false
    }

    showHideAnswerForm() {
        this.showForm = !this.showForm
    }

    showHideAnswers() {
        this.showAnswers = !this.showAnswers
    }

    submitAnswer() {
        this.submitted = true

        this.onAddAnswer.emit({
            commentId: this.comment.id,
            text: this.answerText,
            onSuccess: function() {
                this.answerText = ''
                this.submitted = false
                this.showForm = false
            }.bind(this),
            onError: function() {
                this.submitted = false
            }.bind(this),
        })
    }

}
