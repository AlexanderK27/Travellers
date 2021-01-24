import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserPanelRoutingModule } from './user-panel-routing.module';
import { UserPanelLayoutComponent } from './shared/components/user-panel-layout/user-panel-layout.component';
import { CreatePageComponent } from './pages/create-page/create-page.component';
import { EditPageComponent } from './pages/edit-page/edit-page.component';
import { ProfilePageComponent } from './pages/profile-page/profile-page.component';
import { SharedModule } from '../shared/shared.module';
import { FiltersComponent } from './shared/components/filters/filters.component';
import { NewPostCardComponent } from './shared/components/new-post-card/new-post-card.component';
import { MyPostCardComponent } from './pages/profile-page/my-post-card/my-post-card.component';
import { SettingsPageModule } from './pages/settings-page/settings-page.module';

@NgModule({
    declarations: [
        UserPanelLayoutComponent,
        CreatePageComponent,
        EditPageComponent,
        ProfilePageComponent,
        FiltersComponent,
        NewPostCardComponent,
        MyPostCardComponent
    ],
    imports: [
        CommonModule,
        UserPanelRoutingModule,
        SettingsPageModule,
        SharedModule
    ]
})
export class UserPanelModule {}
