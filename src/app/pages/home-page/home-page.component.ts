import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PublicationService } from 'src/app/shared/services/publication.service';
import { Publication } from 'src/app/shared/interfaces';
import { countries } from 'src/app/shared/db'

@Component({
    selector: 'app-home-page',
    templateUrl: './home-page.component.html',
    styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {
    countries = countries
    form: FormGroup
    publications: Array<Publication>
    searchType = 'author'
    submitted = false

    constructor(
        private pubService: PublicationService
    ) {
        this.pubService.publications$.subscribe(publications => {
            this.publications = publications
        })
    }

    ngOnInit(): void {
        this.form = new FormGroup({
            'category': new FormControl('author'),
            'amountCountries': new FormControl(''),
            'amountCities': new FormControl(''),
            'author': new FormControl('', [Validators.maxLength(20)]),
            'budget': new FormControl(''),
            'city': new FormControl('', [Validators.maxLength(24)]),
            'continent': new FormControl(''),
            'country': new FormControl(''),
            'duration': new FormControl(''),
            'people': new FormControl('')
        })

        this.form.controls['category'].valueChanges.subscribe(value => {
            this.searchType = value
        })

        this.pubService.publications$.next([])
        this.pubService.getTopPublications().subscribe(publications => {
            this.pubService.publications$.next(
                Object.values(publications)
                    .filter(p => p.published === true)
                    .sort((a, b) => a.likes > b.likes ? -1 : 1)
            )
        })
    }

    search() {
        if (this.form.invalid) {
            return
        }

        this.submitted = true

        let filterBy = this.form.value.category
        let equalTo = this.form.value[filterBy]
        filterBy === 'city' ? equalTo = equalTo.toLowerCase() : null
        filterBy !== 'author' ? filterBy = `filters/${filterBy}` : null

        this.pubService.getPublications(filterBy, equalTo)
            .subscribe((publications: {key: Publication}) => {
                this.pubService.publications$.next(
                    Object.values(publications)
                        .filter(p => p.published === true)
                        .sort((a, b) => a.likes > b.likes ? -1 : 1)
                )
                this.submitted = false
            }, () => {
                this.submitted = false
            }
        )
    }
}
