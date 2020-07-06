import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { QuillModule } from 'ngx-quill';
import { PlanCardComponent } from './components/plan-card/plan-card.component';

@NgModule({
    declarations: [PlanCardComponent],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        QuillModule.forRoot()
    ],
    exports: [
        FormsModule,
        ReactiveFormsModule,
        QuillModule,
        PlanCardComponent
    ]
})
export class SharedModule { }
