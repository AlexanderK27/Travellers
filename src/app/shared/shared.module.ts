import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { QuillModule } from 'ngx-quill';
import { PlanCardComponent } from './components/plan-card/plan-card.component';
import { RouterModule } from '@angular/router';
import { ConfirmWindowComponent } from './components/confirm-window/confirm-window.component';

@NgModule({
    declarations: [PlanCardComponent, ConfirmWindowComponent],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
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
