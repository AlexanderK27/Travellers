import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PickerModule } from '@ctrl/ngx-emoji-mart';

import { SharedModule } from 'src/app/shared/shared.module';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { PlanPageComponent } from './plan-page.component';
import { CommentComponent } from './comment/comment.component';

@NgModule({
    declarations: [PlanPageComponent, CommentComponent],
    imports: [CommonModule, SharedModule, AppRoutingModule, PickerModule],
})
export class PlanPageModule {}
