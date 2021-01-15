import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { QuillModule } from 'ngx-quill';
import { RouterModule } from '@angular/router';

import { PostCardComponent } from './components/post-card/post-card.component';
import { ImgCropperComponent } from './components/img-picker/img-cropper/img-cropper.component';
import { ImgPickerComponent } from './components/img-picker/img-picker.component';
import { ConfirmWindowComponent } from './components/confirm-window/confirm-window.component';
import { MainLayoutComponent } from './components/main-layout/main-layout.component';
import { AlertComponent } from './components/alert/alert.component';
import { LoaderComponent } from './components/loader/loader.component';
import { SelectComponent } from './components/select/select.component';
import { FilterPipe } from './components/select/filter.pipe';

@NgModule({
    declarations: [
        PostCardComponent,
        ImgCropperComponent,
        ImgPickerComponent,
        ConfirmWindowComponent,
        MainLayoutComponent,
        AlertComponent,
        LoaderComponent,
        SelectComponent,
        FilterPipe,
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        QuillModule.forRoot(),
    ],
    exports: [
        FormsModule,
        ReactiveFormsModule,
        QuillModule,
        PostCardComponent,
        ImgCropperComponent,
        ImgPickerComponent,
        ConfirmWindowComponent,
        LoaderComponent,
        SelectComponent,
    ],
})
export class SharedModule {}
