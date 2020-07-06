import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { PublicationService } from 'src/app/shared/services/publication.service';
import { Publication } from 'src/app/shared/interfaces';

@Component({
    selector: 'app-plan-page',
    templateUrl: './plan-page.component.html',
    styleUrls: ['./plan-page.component.scss']
})
export class PlanPageComponent implements OnInit {
    publication: Publication

    constructor(
        private route: ActivatedRoute,
        private pubService: PublicationService
    ) { }

    ngOnInit(): void {
        this.route.params.subscribe((params: Params) => {
            this.pubService.getPublication(params.title).subscribe(publication => {
                this.publication = publication
            })
        })
    }

}
