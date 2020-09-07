import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { QuillModule } from 'ngx-quill';
import { RouterModule } from '@angular/router';

import { PlanCardComponent } from './components/plan-card/plan-card.component';
import { ImgCropperComponent } from './components/img-picker/img-cropper/img-cropper.component';
import { ImgPickerComponent } from './components/img-picker/img-picker.component';
import { ConfirmWindowComponent } from './components/confirm-window/confirm-window.component';
import { LoaderComponent } from './components/loader/loader.component';
import { SelectComponent } from './components/select/select.component';
import { FilterPipe } from './components/select/filter.pipe';

@NgModule({
    declarations: [
        PlanCardComponent,
        ImgCropperComponent,
        ImgPickerComponent,
        ConfirmWindowComponent,
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
        PlanCardComponent,
        ImgCropperComponent,
        ImgPickerComponent,
        ConfirmWindowComponent,
        LoaderComponent,
        SelectComponent,
    ],
})
export class SharedModule {}
