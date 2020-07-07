import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { PlanCard, Confirmation } from '../../interfaces';
import { Router } from '@angular/router';
import { PublicationService } from '../../services/publication.service';
import { AlertService } from '../../services/alert.service';

@Component({
    selector: 'app-plan-card',
    templateUrl: './plan-card.component.html',
    styleUrls: ['./plan-card.component.scss']
})
export class PlanCardComponent implements OnInit {
    @Input() plan: PlanCard
    @Input() isAuthor = false
    @Output() deletePub: EventEmitter<string> = new EventEmitter<string>()
    meta = {
        likes: 0,
        dislikes: 0,
        comments: 0,
        saved: false
    }
    window: Confirmation = null

    constructor(
        private alert: AlertService,
        private pubService: PublicationService,
        private router: Router
    ) { }

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

    onPublish() {

    }
}
