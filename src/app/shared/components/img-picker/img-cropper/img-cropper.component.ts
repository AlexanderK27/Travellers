import {
    Component,
    AfterViewInit,
    OnDestroy,
    OnInit,
    ViewChild,
    ElementRef,
    Input,
} from '@angular/core';
import Cropper from 'cropperjs';
import { Subscription, Observable } from 'rxjs';
import { ImagePickerService } from '../image-picker.service';
import { ImageSource } from '../../../types';

export interface canvasParams {
    height: number;
    width: number;
}

@Component({
    selector: 'app-img-cropper',
    templateUrl: './img-cropper.component.html',
    styleUrls: ['./img-cropper.component.scss'],
})
export class ImgCropperComponent implements AfterViewInit, OnDestroy, OnInit {
    @Input() ariaShape = '';
    @Input() aspectRatio = 1;
    @Input() canvasesSizes: canvasParams[];
    @Input() originalImage$: Observable<ImageSource>;
    @ViewChild('originalImage') imageRef: ElementRef;
    croppedImagesSrc: ImageSource[];
    cropperHeight = 0;
    cropperWidth = 0;
    oImageSub: Subscription;
    submitSub: Subscription;
    private cropper: Cropper;

    constructor(private pickerService: ImagePickerService) {}

    ngOnInit() {
        this.cropperHeight = Math.round(
            this.pickerService.cropperWidth / this.aspectRatio
        );
        this.cropperWidth = this.pickerService.cropperWidth;

        this.oImageSub = this.originalImage$.subscribe((_) => {
            if (this.cropper) {
                this.cropper.destroy();

                this.imageRef.nativeElement.onload = () => {
                    this.createCropper();
                };
            }
        });

        this.submitSub = this.pickerService.onSubmitCroppedImage$.subscribe(
            (_) => {
                this.outputCroppedImages();
            }
        );
    }

    ngAfterViewInit() {
        this.createCropper();
    }

    ngOnDestroy() {
        this.oImageSub.unsubscribe();
        this.submitSub.unsubscribe();
    }

    private createCropper() {
        this.cropper = new Cropper(this.imageRef.nativeElement, {
            zoomable: false,
            scalable: false,
            aspectRatio: this.aspectRatio,
            crop: () => {
                this.croppedImagesSrc = this.canvasesSizes.map((params) => {
                    const canvas = this.cropper.getCroppedCanvas(params);
                    return canvas.toDataURL('image/jpeg');
                });
            },
        });
    }

    private outputCroppedImages() {
        this.pickerService.onImageCropped(this.croppedImagesSrc);
        this.cropper.destroy();
    }
}
