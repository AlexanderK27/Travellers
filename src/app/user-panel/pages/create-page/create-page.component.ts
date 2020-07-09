import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PlanCard } from 'src/app/shared/interfaces';
import { AlertService } from 'src/app/shared/services/alert.service';
import { UserService } from 'src/app/shared/services/user.service';
import { PublicationService } from 'src/app/shared/services/publication.service';

@Component({
    selector: 'app-create-page',
    templateUrl: './create-page.component.html',
    styleUrls: ['./create-page.component.scss']
})
export class CreatePageComponent implements OnInit {
    form: FormGroup
    quillConfig = {
        toolbar: [
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'script': 'sub'}, { 'script': 'super' }],
            [{ 'header': 1 }, { 'header': 2 }],
            [{ 'list': 'ordered'}, { 'list': 'bullet' }, { 'align': [] }, 'blockquote'],
            [{ 'indent': '-1'}, { 'indent': '+1' }],
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
            [{ 'size': ['small', false, 'large', 'huge'] }],
            [{ 'color': [] }, { 'background': [] }],
            ['link', 'image']
        ]
    }
    quillStyle = {
        minHeight: '300px',
        fontSize: '1rem'
    }
    planView: PlanCard = {
        author: this.userService.user.username,
        authorId: this.userService.user.userId,
        authorAv: this.userService.user.minAvatar,
        poster: '../../../../assets/avatar.jpg',
        title: 'Week in France'
    }
    submitted = false

    constructor(
        private alert: AlertService,
        private publications: PublicationService,
        private userService: UserService
    ) {}

    ngOnInit(): void {
        this.form = new FormGroup({
            title: new FormControl('Week in France', [Validators.required, Validators.maxLength(150)]),
            text: new FormControl('', [Validators.required])
        })
    }

    onSubmit() {
        if (this.form.invalid) {
            return
        }

        this.submitted = true

        const publication = {
            published: false,
            created: new Date(),
            ...this.planView,
            text: this.form.value.text
        }

        if (publication.poster === '../../../../assets/avatar.jpg') {
            publication.poster = ''
        }

        this.publications.createPublication(publication).subscribe(resp => {
            this.userService.userData$.next({
                ...this.userService.user,
                publications: this.userService.user.publications + 1
            })
            this.form.reset()
            this.planView = {
                author: this.userService.user.username,
                authorId: this.userService.user.userId,
                authorAv: this.userService.user.minAvatar,
                poster: '../../../../assets/avatar.jpg',
                title: 'Week in France'
            }
            this.alert.success('Your publication has been saved')
        }, (e) => {
            console.log(e)
        }, () => {
            this.submitted = false
        })
    }

    setPlanViewTitle() {
        this.planView.title = this.form.value.title
    }

    selectedFile = null
    uploadFile(event) {
        this.selectedFile = event.target.files[0]

        if (!this.selectedFile) {
            return
        }

        if (this.selectedFile.type !== 'image/png' && this.selectedFile.type !== 'image/jpeg') {
            return this.alert.warning('Only .png, .jpg and .jpeg formats are supported')
        }

        const reader = new FileReader()
        reader.readAsDataURL(this.selectedFile);
        reader.onload = () => {
            this.planView.poster = reader.result
        }
    }
}
