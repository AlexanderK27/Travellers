import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainLayoutComponent } from './shared/components/main-layout/main-layout.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { SubsPageComponent } from './pages/subs-page/subs-page.component';
import { SavedPageComponent } from './pages/saved-page/saved-page.component';
import { PlanPageComponent } from './pages/plan-page/plan-page.component';
import { AuthPageComponent } from './pages/auth-page/auth-page.component';

const routes: Routes = [
    {
        path: '', component: MainLayoutComponent, children: [
            { path: '', redirectTo: '/', pathMatch: 'full' },
            { path: '', component: HomePageComponent },
            { path: 'subscriptions', component: SubsPageComponent },
            { path: 'saved', component: SavedPageComponent },
            { path: 'plan/:title', component: PlanPageComponent },
            { path: 'authorization', component: AuthPageComponent },
            { path: 'profile', loadChildren: () => (
                    import('./user-panel/user-panel.module').then(m => m.UserPanelModule)
                )
            }
        ]
    },
    {
        path: '**', redirectTo: '/'
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {}
