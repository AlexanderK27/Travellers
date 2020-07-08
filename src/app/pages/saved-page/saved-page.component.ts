import { Component, OnInit } from '@angular/core';
import { Publication } from 'src/app/shared/interfaces';
import { PublicationService } from 'src/app/shared/services/publication.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-saved-page',
    templateUrl: './saved-page.component.html',
    styleUrls: ['./saved-page.component.scss']
})
export class SavedPageComponent implements OnInit {
    loading = true
    publications: Array<Publication> = []
    pubSub: Subscription

    constructor(
        private pubService: PublicationService
    ) {}

    ngOnInit(): void {
        this.pubService.publications$.next([])
        this.pubService.getSavedPublications()
        this.pubSub = this.pubService.publications$.subscribe(pubs => {
            this.publications = pubs
            this.loading = false
        })
    }

}
