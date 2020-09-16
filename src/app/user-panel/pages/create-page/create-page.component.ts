import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { PlanCard, Filters } from 'src/app/shared/interfaces';
import { AlertService } from 'src/app/shared/services/alert.service';
import { UserService } from 'src/app/shared/services/user.service';
import { PublicationService } from 'src/app/shared/services/publication.service';
import { ImagePickerService } from 'src/app/shared/components/img-picker/image-picker.service';

@Component({
    selector: 'app-create-page',
    templateUrl: './create-page.component.html',
    styleUrls: ['./create-page.component.scss'],
})
export class CreatePageComponent implements OnInit {
    filterValues: Filters = {
        amountCities: '',
        amountCountries: '',
        budget: '',
        city: '',
        continent: '',
        country: '',
        duration: '',
        people: '',
    };
    form: FormGroup;
    planView: PlanCard = null;
    selectedFile = null;
    submitted = false;
    userSub: Subscription;
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
        private alert: AlertService,
        private publications: PublicationService,
        public pickerService: ImagePickerService,
        private router: Router,
        private userService: UserService
    ) {}

    ngOnInit(): void {
        this.userSub = this.userService.userData$.subscribe((user) => {
            if (user) {
                this.planView = {
                    author: this.userService.user.username,
                    authorId: this.userService.user.userId,
                    authorAv: this.userService.user.minAvatar,
                    poster: '',
                    title: 'My first title',
                    created: new Date(),
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

    onSubmit() {
        if (this.form.invalid) {
            return;
        }

        this.submitted = true;

        const publication = {
            published: false,
            created: new Date(),
            filters: {
                ...this.filterValues,
                city: !this.filterValues.city
                    ? ''
                    : this.filterValues.city.trim().toLowerCase(),
            },
            ...this.planView,
            poster: this.pickerService.croppedImagesSrc[0] || '',
            text: this.form.value.text,
        };

        this.publications.createPublication(publication).subscribe(
            () => {
                this.userService.userData$.next({
                    ...this.userService.user,
                    publications: this.userService.user.publications + 1,
                });
                this.alert.success('Your publication has been saved');
                this.router.navigate(['/profile']);
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

    uploadFile(event) {
        this.selectedFile = event.target.files[0];

        if (!this.selectedFile) {
            return;
        }

        if (
            this.selectedFile.type !== 'image/png' &&
            this.selectedFile.type !== 'image/jpeg'
        ) {
            return this.alert.warning(
                'Only .png, .jpg and .jpeg formats are supported'
            );
        }

        const reader = new FileReader();
        reader.readAsDataURL(this.selectedFile);
        reader.onload = () => {
            this.planView.poster = reader.result;
        };
    }
}
