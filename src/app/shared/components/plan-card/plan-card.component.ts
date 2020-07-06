import { Component, OnInit, Input } from '@angular/core';
import { PlanCard } from '../../interfaces';

@Component({
    selector: 'app-plan-card',
    templateUrl: './plan-card.component.html',
    styleUrls: ['./plan-card.component.scss']
})
export class PlanCardComponent implements OnInit {
    @Input() plan: PlanCard
    @Input() isAuthor = false
    meta = {
        likes: 0,
        dislikes: 0,
        comments: 0,
        saved: false
    }

    constructor() { }

    ngOnInit(): void {
    }

    onEdit() {

    }

    onDelete() {

    }

    onPublish() {

    }
}
