import {
    Component,
    Input,
    OnInit,
    OnDestroy,
    ViewChild,
    ElementRef,
    AfterViewInit
} from '@angular/core';
import { Subscription, BehaviorSubject } from 'rxjs';
import { AlertService } from 'src/app/shared/services/alert.service';
import { ImageSource } from '../../types';
import { ImagePickerService } from './image-picker.service';
import { canvasParams } from './img-cropper/img-cropper.component';

@Component({
    selector: 'app-img-picker',
    templateUrl: './img-picker.component.html',
    styleUrls: ['./img-picker.component.scss'],
})
export class ImgPickerComponent implements OnInit, OnDestroy, AfterViewInit {
    @Input() cropperAriaShape = '';
    @Input() cropperAspectRatio = 1;
    @Input() croppedSizes: canvasParams[];
    @Input('src') defaultImageSrc: ImageSource;
    @ViewChild('fileUploadInput') fileInputRef: ElementRef;
    @ViewChild('container') rootElRef: ElementRef;

    croppedImageSrc: ImageSource;
    uploadedImageSrc$: BehaviorSubject<ImageSource> = new BehaviorSubject<
        ImageSource
    >('');
    uSub: Subscription;

    constructor(
        private alert: AlertService,
        public pickerService: ImagePickerService
    ) {}

    ngOnInit() {
        this.uSub = this.pickerService.onUploadFile$.subscribe((_) => {
            this.fileInputRef.nativeElement.click();
        });
    }

    ngAfterViewInit() {
        this.pickerService.setCropperWidth(this.rootElRef.nativeElement.clientWidth);
    }

    uploadFile(event: Event) {
        const selectedFile = event.target['files'][0];

        if (!selectedFile) return;

        if (
            selectedFile.type !== 'image/png' &&
            selectedFile.type !== 'image/jpeg'
        ) {
            return this.alert.warning(
                'Only .png, .jpg and .jpeg formats are supported'
            );
        }

        const reader = new FileReader();
        reader.readAsDataURL(selectedFile);
        reader.onload = () => {
            this.uploadedImageSrc$.next(reader.result);
            this.pickerService.displayCropper();
        };
    }

    ngOnDestroy() {
        this.uSub.unsubscribe();
        this.pickerService.resetImage();
    }
}
