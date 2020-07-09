import { Component, OnInit } from '@angular/core';
import { PublicationService } from 'src/app/shared/services/publication.service';
import { Publication } from 'src/app/shared/interfaces';

@Component({
    selector: 'app-home-page',
    templateUrl: './home-page.component.html',
    styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {
    publications: Array<Publication>

    constructor(
        private pubService: PublicationService
    ) {
        this.pubService.publications$.subscribe(pubs => {
            this.publications = pubs
        })
    }

    ngOnInit(): void {
        this.pubService.publications$.next([])
        this.pubService.getTopPublications().subscribe(pubs => {
            this.pubService.publications$.next(
                Object.values(pubs).sort((a, b) => a.likes > b.likes ? -1 : 1)
            )
        })
    }

}
