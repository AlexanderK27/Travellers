import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { switchMap, take } from 'rxjs/operators';

import { PlanCard, Publication, Filters } from 'src/app/shared/interfaces';
import { AlertService } from 'src/app/shared/services/alert.service';
import { PublicationService } from 'src/app/shared/services/publication.service';
import { AvatarService } from 'src/app/shared/services/avatar.service';
import { ImagePickerService } from 'src/app/shared/components/img-picker/image-picker.service';

@Component({
    selector: 'app-edit-page',
    templateUrl: './edit-page.component.html',
    styleUrls: ['./edit-page.component.scss'],
})
export class EditPageComponent implements OnInit {
    filterValues: Filters;
    form: FormGroup;
    loading = true;
    planView: PlanCard;
    pubId: string;
    selectedFile = null;
    submitted = false;
    quillConfig = {
        toolbar: [
            ['bold', 'italic', 'underline', 'strike'],
            [{ script: 'sub' }, { script: 'super' }],
            [
                { list: 'ordered' },
                { list: 'bullet' },
                { align: [] },
                'blockquote',
            ],
            [{ indent: '-1' }, { indent: '+1' }],
            [{ header: [1, 2, 3, 4, 5, 6, false] }],
            [{ size: ['small', false, 'large', 'huge'] }],
            [{ color: [] }, { background: [] }, 'link', 'image'],
        ],
    };
    quillStyle = { minHeight: '500px', padding: '10px 16px' };

    constructor(
        private avatarService: AvatarService,
        private alert: AlertService,
        public pickerService: ImagePickerService,
        private publications: PublicationService,
        private route: ActivatedRoute,
        private router: Router,
        private title: Title
    ) {}

    ngOnInit(): void {
        this.title.setTitle('Editing • Travellers');

        this.route.params
            .pipe(
                switchMap((params: Params) => {
                    this.pubId = params.id;
                    return this.publications.getPublication(params.id);
                })
            )
            .subscribe(
                (publication: Publication) => {
                    if (!publication) {
                        this.alert.danger('Publication not found');
                        return this.router.navigate(['/profile']);
                    }

                    this.form = new FormGroup({
                        title: new FormControl(publication.title, [
                            Validators.required,
                            Validators.maxLength(100),
                        ]),
                        text: new FormControl(publication.text, [
                            Validators.required,
                        ]),
                    });
                    this.filterValues = {
                        amountCities: publication.filters.amountCities,
                        amountCountries: publication.filters.amountCountries,
                        budget: publication.filters.budget,
                        city: publication.filters.city,
                        continent: publication.filters.continent,
                        country: publication.filters.country,
                        duration: publication.filters.duration,
                        people: publication.filters.people,
                    };
                    this.avatarService
                        .getMinAvatars([publication.author])
                        .pipe(take(1))
                        .subscribe((avatar) => {
                            this.planView = {
                                author: publication.author,
                                authorId: publication.authorId,
                                authorAv: avatar[0].avatar,
                                created: publication.created,
                                poster: publication.poster,
                                title: publication.title,
                            };
                            this.loading = false;
                        });
                },
                (e) => {
                    this.alert.danger('Unknown error');
                    this.router.navigate(['/profile']);
                }
            );
    }

    saveChanges() {
        if (this.form.invalid) {
            return;
        }

        this.submitted = true;

        const modifications = {
            modified: new Date(),
            poster:
                this.pickerService.croppedImagesSrc[0] || this.planView.poster,
            title: this.planView.title,
            text: this.form.value.text,
            filters: {
                ...this.filterValues,
                city: !this.filterValues.city
                    ? ''
                    : this.filterValues.city.trim().toLowerCase(),
            },
        };

        this.publications
            .updatePublication(
                modifications,
                this.planView.authorId,
                this.pubId
            )
            .subscribe(
                () => {
                    this.alert.success('Changes have been saved');
                    this.submitted = false;
                },
                (e) => {
                    this.alert.warning(`Unknown error: ${e}`);
                    this.submitted = false;
                }
            );
    }

    setFilterValues(values: Filters) {
        this.filterValues = { ...values };
    }

    setPlanViewTitle() {
        this.planView.title = this.form.value.title;
    }
}
