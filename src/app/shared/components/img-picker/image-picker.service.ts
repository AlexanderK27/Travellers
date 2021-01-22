import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface ICanvasDimentions {
    height: number;
    width: number;
}

export type imageSource = string | ArrayBuffer;

export type imageType = 'avatar' | 'poster';

export const CROPPED_AVATAR_DIMENTIONS: ICanvasDimentions = {
    height: 480,
    width: 480
}

export const CROPPED_POSTER_DIMENTIONS: ICanvasDimentions = {
    height: 480,
    width: 600
}

@Injectable({ providedIn: 'root' })
export class ImagePickerService {
    cropperWidth = 300;
    croppedImageSrc: imageSource;
    displayedCroppedImage: imageSource;
    onSubmitCroppedImage$: Subject<unknown> = new Subject<unknown>();
    onResetImage$: Subject<unknown> = new Subject<unknown>();
    onUploadFile$: Subject<unknown> = new Subject<unknown>();
    showCropper = false;
    showNewImage = false;

    constructor() {}

    displayCroppedImage() {
        this.showCropper = false;
        this.showNewImage = true;
    }

    displayCropper() {
        this.showNewImage = false;
        this.showCropper = true;
    }

    getCroppedImage() {
        return this.croppedImageSrc ? this.croppedImageSrc.slice(23) : '';
    }

    onImageCropped(croppedImage: imageSource) {
        this.setCroppedImageSrc(croppedImage);
        this.displayedCroppedImage = croppedImage;
        this.displayCroppedImage();
    }

    resetImage() {
        this.showCropper = false;
        this.showNewImage = false;
        this.setCroppedImageSrc('');
        this.onResetImage$.next();
    }

    setCropperWidth(width: number) {
        this.cropperWidth = width;
    }

    submitCroppedImage() {
        this.onSubmitCroppedImage$.next();
        this.onResetImage$.next();
    }

    triggerFileUploadInput() {
        this.onUploadFile$.next();
    }

    private setCroppedImageSrc(croppedImage: imageSource) {
        this.croppedImageSrc = croppedImage;
    }
}
