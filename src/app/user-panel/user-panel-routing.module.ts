import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserPanelLayoutComponent } from './shared/components/user-panel-layout/user-panel-layout.component';
import { ProfilePageComponent } from './pages/profile-page/profile-page.component';
import { CreatePageComponent } from './pages/create-page/create-page.component';
import { EditPageComponent } from './pages/edit-page/edit-page.component';
import { SettingsPageComponent } from './pages/settings-page/settings-page.component';

const routes: Routes = [
    {
        path: '', component: UserPanelLayoutComponent, children: [
            { path: '', redirectTo: '/profile', pathMatch: 'full' },
            { path: '', component: ProfilePageComponent },
            { path: 'create', component: CreatePageComponent },
            { path: 'edit/:id', component: EditPageComponent },
            { path: 'settings', component: SettingsPageComponent },
            { path: '**', redirectTo: '/profile' }
        ]
    }
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class UserPanelRoutingModule {}
