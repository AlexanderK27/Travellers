import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PlanCard, Publication } from 'src/app/shared/interfaces';
import { AlertService } from 'src/app/shared/services/alert.service';
import { PublicationService } from 'src/app/shared/services/publication.service';
import { switchMap } from 'rxjs/operators';

@Component({
    selector: 'app-edit-page',
    templateUrl: './edit-page.component.html',
    styleUrls: ['./edit-page.component.scss']
})
export class EditPageComponent implements OnInit {
    form: FormGroup
    planView: PlanCard
    pubId: string
    selectedFile = null
    submitted = false
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
    quillStyle = {minHeight: '300px'}

    constructor(
        private alert: AlertService,
        private route: ActivatedRoute,
        private publications: PublicationService
    ) {}

    ngOnInit(): void {
        this.route.params.pipe(
            switchMap((params: Params) => {
                this.pubId = params.id
                return this.publications.getPublication(params.id)
            })
          ).subscribe((publication: Publication) => {
                this.planView = {
                    author: publication.author,
                    authorId: publication.authorId,
                    poster: publication.poster || '../../../../assets/avatar.jpg',
                    title: publication.title
                }
                this.form = new FormGroup({
                    title: new FormControl(publication.title, [Validators.required, Validators.maxLength(100)]),
                    text: new FormControl(publication.text, [Validators.required])
                })
          })
    }

    onSubmit() {
        if (this.form.invalid) {
            return
        }

        this.submitted = true

        const modifications = {
            modified: new Date(),
            poster: this.planView.poster,
            title: this.planView.title,
            text: this.form.value.text
        }

        if (modifications.poster === '../../../../assets/avatar.jpg') {
            modifications.poster = ''
        }

        this.publications.updatePublication(modifications, this.planView.authorId, this.pubId)
            .subscribe(resp => {
                console.log(resp)
                this.alert.success('Changes have been saved')
            }, (e) => {
                console.log(e)
            }, () => {
                this.submitted = false
            }
        )
    }

    setPlanViewTitle() {
        this.planView.title = this.form.value.title
    }

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
