import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { switchMap, take } from 'rxjs/operators';

import { AlertService } from 'src/app/shared/services/alert.service';
import { PostService } from 'src/app/shared/services/post/post.service';
import { AvatarService } from 'src/app/shared/services/avatar.service';
import { ImagePickerService } from 'src/app/shared/components/img-picker/image-picker.service';
import { IPost, IPostCard } from 'src/app/shared/services/post/post.interfaces';
import { IFilterValues, quillEditorSettings } from '../create-page/create-page.component';

@Component({
    selector: 'app-edit-page',
    templateUrl: './edit-page.component.html',
    styleUrls: ['./edit-page.component.scss'],
})
export class EditPageComponent implements OnInit {
    filterValues: IFilterValues;
    form: FormGroup;
    loading = true;
    postCard: IPostCard;
    pubId: string;
    selectedFile = null;
    submitted = false;
    quillConfig = quillEditorSettings.config;
    quillStyle = quillEditorSettings.style;

    constructor(
        private avatarService: AvatarService,
        private alert: AlertService,
        public pickerService: ImagePickerService,
        private postService: PostService,
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
                    return this.postService.getOne(+params.id);
                })
            )
            .subscribe(
                (post: IPost) => {
                    if (!post) {
                        this.alert.danger('Publication not found');
                        return this.router.navigate(['/profile']);
                    }

                    this.form = new FormGroup({
                        title: new FormControl(post.title, [
                            Validators.required,
                            Validators.maxLength(100),
                        ]),
                        text: new FormControl(post.post_text, [
                            Validators.required,
                        ]),
                    });
                    this.filterValues = {
                        amount_of_cities: post.filters.amount_of_cities,
                        amount_of_countries: post.filters.amount_of_countries,
                        budget: post.filters.budget,
                        city: post.filters.city[0],
                        continent: post.filters.continent[0],
                        country: post.filters.country[0],
                        amount_of_days: post.filters.amount_of_days,
                        amount_of_people: post.filters.amount_of_people,
                    };
                    this.avatarService
                        .getMinAvatars([post.author_name])
                        .pipe(take(1))
                        .subscribe((avatar) => {
                            this.postCard = {
                                author_name: post.author_name,
                                author_avatar: avatar[0].avatar,
                                post_id: post.post_id,
                                post_created_at: post.post_created_at,
                                poster: post.poster,
                                title: post.title,
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
            post_modified_at: new Date(),
            poster:
                this.pickerService.croppedImagesSrc[0] || this.postCard.poster,
            title: this.postCard.title,
            post_text: this.form.value.text,
            filters: {
                ...this.filterValues,
                continent: [this.filterValues.continent[0]],
                country: [this.filterValues.country[0]],
                city: !this.filterValues.city
                    ? ['']
                    : [this.filterValues.city.trim().toLowerCase()],
            },
        };

        this.postService
            .updateOne(
                modifications,
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

    setFilterValues(values: IFilterValues) {
        this.filterValues = { ...values };
    }

    setPostCardTitle() {
        this.postCard.title = this.form.value.title;
    }
}
