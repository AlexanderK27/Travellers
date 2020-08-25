import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AvatarService } from 'src/app/shared/services/avatar.service';
import { PublicationService } from 'src/app/shared/services/publication.service';
import { Publication, MiniatureAvatar } from 'src/app/shared/interfaces';
import { countries } from 'src/app/shared/db'
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-home-page',
    templateUrl: './home-page.component.html',
    styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit, OnDestroy {
    avatars: MiniatureAvatar[]
    aSub: Subscription
    countries = countries
    form: FormGroup
    loading = true
    publications: Array<Publication>
    pubSub: Subscription
    searchType = 'author'
    submitted = false

    constructor(
        private avatarService: AvatarService,
        private pubService: PublicationService
    ) {}

    ngOnInit(): void {
        this.pubSub = this.pubService.publications$.subscribe(p => this.publications = p)

        this.pubService.getTopPublications().subscribe(publications => {
                const pubs = Object.values(publications).filter(p => p.published === true)

                const usernames = pubs.map(publication => publication.author)

                this.aSub = this.avatarService.getMinAvatars(usernames).subscribe(avatars => {
                    pubs.forEach(publication => {
                        publication.authorAv = avatars.find(a => a.username === publication.author).avatar
                    })

                    this.pubService.publications$.next(pubs.sort((a, b) => {
                        return (b.likes ? b.likes : 0) - (a.likes ? a.likes : 0)
                    }))
                    this.loading = false
                })
        })

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

        this.form.controls['category'].valueChanges.subscribe(value => this.searchType = value)
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
                const pubs = Object.values(publications).filter(p => p.published === true)
                const usernames = pubs.map(publication => publication.author)

                const avatarSub = this.avatarService.getMinAvatars(usernames).subscribe(avatars => {
                    pubs.forEach(publication => {
                        publication.authorAv = avatars.find(a => a.username === publication.author).avatar
                    })

                    this.pubService.publications$.next(pubs.sort((a, b) => {
                        return (b.likes ? b.likes : 0) - (a.likes ? a.likes : 0)
                    }))

                    this.submitted = false
                    avatarSub.unsubscribe()
                })
        })
    }

    ngOnDestroy() {
        this.aSub.unsubscribe()
        this.pubSub.unsubscribe()
    }
}
