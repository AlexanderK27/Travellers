import { Component, Input, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AlertService } from 'src/app/shared/services/alert.service';
import { AvatarService } from '../../services/avatar.service';
import { ImageSource } from '../../types';

@Component({
    selector: 'app-img-picker',
    templateUrl: './img-picker.component.html',
    styleUrls: ['./img-picker.component.scss']
})
export class ImgPickerComponent implements OnDestroy {
    @Input('src') defaultImageSrc: ImageSource = '../../../../assets/avatar.jpg'
    croppedAvatarSub: Subscription
    croppedImageSrc: ImageSource
    selectedFile = null
    showCropper = false
    showNewImage = false

    constructor(
        private alert: AlertService,
        public avatarService: AvatarService
    ) {
        this.croppedAvatarSub = this.avatarService.croppedAvatar$.subscribe(value => {
            this.croppedImageSrc = value

            if(value) {
                this.showCropper = false
                this.showNewImage = true
            }
        })
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
            this.avatarService.avatar$.next(reader.result)
            this.showNewImage = false
            this.showCropper = true
        }
    }

    onResetAvatar() {
        this.showCropper = false
        this.showNewImage = false
        this.selectedFile = null
        this.avatarService.avatar$.next('')
        this.avatarService.croppedAvatar$.next('')
        this.avatarService.minCroppedAvatar$.next('')
    }

    ngOnDestroy() {
        this.croppedAvatarSub.unsubscribe()
    }
}
