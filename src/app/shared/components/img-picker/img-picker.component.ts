import {
    Component,
    Input,
    OnInit,
    OnDestroy,
    ViewChild,
    ElementRef,
    AfterViewInit,
} from '@angular/core';
import { Subscription, BehaviorSubject } from 'rxjs';

import { AlertService } from 'src/app/shared/services/alert.service';
import {
    CROPPED_AVATAR_DIMENTIONS,
    CROPPED_POSTER_DIMENTIONS,
    ICanvasDimentions,
    ImagePickerService,
    imageSource,
    imageType
} from './image-picker.service';

@Component({
    selector: 'app-img-picker',
    templateUrl: './img-picker.component.html',
    styleUrls: ['./img-picker.component.scss'],
})
export class ImgPickerComponent implements OnInit, OnDestroy, AfterViewInit {
    @Input() cropperAriaShape = '';
    @Input() cropperAspectRatio = 1;
    @Input('src') defaultImageSrc: imageSource;
    @Input() type: imageType;
    @ViewChild('fileUploadInput') fileInputRef: ElementRef;
    @ViewChild('container') rootElRef: ElementRef;

    croppedImageDimentions: ICanvasDimentions;
    croppedImageSrc: imageSource;
    uploadedImageSrc$: BehaviorSubject<imageSource> = new BehaviorSubject<
        imageSource
    >('');
    uSub: Subscription;
    rSub: Subscription;

    constructor(
        private alert: AlertService,
        public pickerService: ImagePickerService
    ) {}

    ngOnInit() {
        this.uSub = this.pickerService.onUploadFile$.subscribe((_) => {
            this.fileInputRef.nativeElement.click();
        });
        this.rSub = this.pickerService.onResetImage$.subscribe((_) => {
            this.fileInputRef.nativeElement.value = '';
        })

        switch (this.type) {
            case 'avatar': {
                this.croppedImageDimentions = CROPPED_AVATAR_DIMENTIONS;
                break;
            }
            case 'poster': {
                this.croppedImageDimentions = CROPPED_POSTER_DIMENTIONS;
                break;
            }
        }
    }

    ngAfterViewInit() {
        this.pickerService.setCropperWidth(
            this.rootElRef.nativeElement.clientWidth
        );
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
