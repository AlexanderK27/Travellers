import { Component, AfterViewInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import Cropper from 'cropperjs'
import { Subscription } from 'rxjs';
import { AvatarService } from '../../services/avatar.service';

@Component({
    selector: 'app-img-cropper',
    templateUrl: './img-cropper.component.html',
    styleUrls: ['./img-cropper.component.scss']
})
export class ImgCropperComponent implements AfterViewInit, OnDestroy {
    @ViewChild('originalImage') imageElement: ElementRef;
    avatarSub: Subscription
    croppedImageSource = ''
    minCroppedImageSource = ''
    originalImageSource: string | ArrayBuffer

    private cropper: Cropper

    constructor(private avatarService: AvatarService) {
        this.avatarSub = this.avatarService.avatar$.subscribe(value => {
            this.originalImageSource = value

            if (this.cropper) {
                this.cropper.destroy()

                this.imageElement.nativeElement.onload = () => {
                    this.createCropper()
                }
            }
        })
    }

    ngAfterViewInit() {
        this.createCropper()
    }

    ngOnDestroy() {
        this.avatarSub.unsubscribe()
    }

    onSubmitAvatar() {
        this.avatarService.croppedAvatar$.next(this.croppedImageSource)
        this.avatarService.minCroppedAvatar$.next(this.minCroppedImageSource)
        this.cropper.destroy()
    }

    private createCropper() {
        this.cropper = new Cropper(this.imageElement.nativeElement, {
            zoomable: false,
            scalable: false,
            aspectRatio: 1,
            crop: () => {
                const canvas = this.cropper.getCroppedCanvas({width: 420, height: 420})
                this.croppedImageSource = canvas.toDataURL('image/jpeg')
                const minCanvas = this.cropper.getCroppedCanvas({width: 36, height: 36})
                this.minCroppedImageSource = minCanvas.toDataURL('image/jpeg')
            }
        })
    }
}
