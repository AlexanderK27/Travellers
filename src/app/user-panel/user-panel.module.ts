import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserPanelRoutingModule } from './user-panel-routing.module';
import { UserPanelLayoutComponent } from './shared/components/user-panel-layout/user-panel-layout.component';
import { CreatePageComponent } from './pages/create-page/create-page.component';
import { EditPageComponent } from './pages/edit-page/edit-page.component';
import { ProfilePageComponent } from './pages/profile-page/profile-page.component';
import { SettingsPageComponent } from './pages/settings-page/settings-page.component';

@NgModule({
    declarations: [
        UserPanelLayoutComponent,
        CreatePageComponent,
        EditPageComponent,
        ProfilePageComponent,
        SettingsPageComponent
    ],
    imports: [
        CommonModule,
        UserPanelRoutingModule
    ]
})
export class UserPanelModule {}
