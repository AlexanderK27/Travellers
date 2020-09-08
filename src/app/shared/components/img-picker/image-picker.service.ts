import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { ImageSource } from '../../types';

@Injectable({ providedIn: 'root' })
export class ImagePickerService {
    cropperWidth = 300;
    croppedImagesSrc: ImageSource[] = [];
    displayedCroppedImage: ImageSource;
    onSubmitCroppedImage$: Subject<any> = new Subject<any>();
    onUploadFile$: Subject<any> = new Subject<any>();
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

    onImageCropped(croppedImages: ImageSource[]) {
        this.setCroppedImagesSrc(croppedImages);
        this.displayedCroppedImage = croppedImages[0];
        this.displayCroppedImage();
    }

    resetImage() {
        this.showCropper = false;
        this.showNewImage = false;
        this.setCroppedImagesSrc([]);
    }

    setCropperWidth(width: number) {
        this.cropperWidth = width;
    }

    submitCroppedImage() {
        this.onSubmitCroppedImage$.next();
    }

    triggerFileUploadInput() {
        this.onUploadFile$.next();
    }

    private setCroppedImagesSrc(croppedImages: ImageSource[]) {
        this.croppedImagesSrc = [...croppedImages];
    }
}
