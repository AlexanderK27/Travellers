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
import { ICanvasDimentions, ImagePickerService, imageSource } from '../image-picker.service';

@Component({
    selector: 'app-img-cropper',
    templateUrl: './img-cropper.component.html',
    styleUrls: ['./img-cropper.component.scss'],
})
export class ImgCropperComponent implements AfterViewInit, OnDestroy, OnInit {
    @Input() ariaShape = '';
    @Input() aspectRatio = 1;
    @Input() canvasDimentions: ICanvasDimentions;
    @Input() originalImage$: Observable<imageSource>;
    @ViewChild('originalImage') imageRef: ElementRef;
    croppedImageSrc: imageSource;
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
                const canvas = this.cropper.getCroppedCanvas(this.canvasDimentions);
                this.croppedImageSrc = canvas.toDataURL('image/jpeg');
            },
        });
    }

    private outputCroppedImages() {
        this.pickerService.onImageCropped(this.croppedImageSrc);
        this.cropper.destroy();
    }
}
