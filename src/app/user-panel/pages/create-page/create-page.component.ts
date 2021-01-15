import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

import { AlertService } from 'src/app/shared/services/alert.service';
import { UserService } from 'src/app/shared/services/user/user.service';
import { PostService } from 'src/app/shared/services/post/post.service';
import { ImagePickerService } from 'src/app/shared/components/img-picker/image-picker.service';
import { INewPost, INewPostCard } from 'src/app/shared/services/post/post.interfaces';

export interface IFilterValues {
    amount_of_cities: number,
    amount_of_countries: number,
    amount_of_people: number,
    amount_of_days: number,
    budget: number,
    city: string,
    continent: string,
    country: string,
}

export const quillEditorSettings = {
    config: {
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
    },
    style: { minHeight: '500px', padding: '10px 16px' }
}

@Component({
    selector: 'app-create-page',
    templateUrl: './create-page.component.html',
    styleUrls: ['./create-page.component.scss'],
})
export class CreatePageComponent implements OnInit {
    filterValues: IFilterValues = {
        amount_of_cities: 0,
        amount_of_countries: 0,
        amount_of_people: 0,
        amount_of_days: 0,
        budget: 0,
        city: '',
        continent: '',
        country: '',
    };
    form: FormGroup;
    postCard: INewPostCard = null;
    selectedFile = null;
    submitted = false;
    userSub: Subscription;
    quillConfig = quillEditorSettings.config;
    quillStyle = quillEditorSettings.style;

    constructor(
        private alert: AlertService,
        private postService: PostService,
        public pickerService: ImagePickerService,
        private router: Router,
        private userService: UserService,
        private title: Title
    ) {}

    ngOnInit(): void {
        this.title.setTitle('Creating • Travellers');

        this.userSub = this.userService.userData$.subscribe((user) => {
            if (user) {
                this.postCard = {
                    author_name: this.userService.user.username,
                    author_avatar: this.userService.user.minAvatar,
                    poster: '',
                    title: 'My first title'
                };
            }
        });
        this.form = new FormGroup({
            title: new FormControl('', [
                Validators.required,
                Validators.maxLength(100),
            ]),
            text: new FormControl('', [Validators.required]),
        });
    }

    saveArticle() {
        if (this.form.invalid) {
            return;
        }

        this.submitted = true;

        const post: INewPost = {
            filters: {
                ...this.filterValues,
                continent: [this.filterValues.continent],
                country: [this.filterValues.country],
                city: !this.filterValues.city
                    ? ['']
                    : [this.filterValues.city.trim().toLowerCase()],
            },
            ...this.postCard,
            author_avatar: '',
            poster: this.pickerService.croppedImagesSrc[0] || '',
            post_text: this.form.value.text,
        };

        this.postService.createOne(post).subscribe(
            () => {
                this.userService.userData$.next({
                    ...this.userService.user,
                    posts: this.userService.user.posts + 1,
                });
                this.alert.success('Your article has been saved');
                this.router.navigate(['/profile']);
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

    setPlanViewTitle() {
        this.postCard.title = this.form.value.title;
    }
}
