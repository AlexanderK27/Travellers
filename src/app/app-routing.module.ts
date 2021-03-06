import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './shared/services/auth/auth.guard';
import { MainLayoutComponent } from './shared/components/main-layout/main-layout.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { SubsPageComponent } from './pages/subs-page/subs-page.component';
import { SavedPageComponent } from './pages/saved-page/saved-page.component';
import { PostPageComponent } from './pages/post-page/post-page.component';
import { AuthorPageComponent } from './pages/author-page/author-page.component';
import { AuthPageComponent } from './pages/auth-page/auth-page.component';

const routes: Routes = [
    {
        path: '',
        component: MainLayoutComponent,
        children: [
            { path: '', redirectTo: '/', pathMatch: 'full' },
            { path: '', component: HomePageComponent },
            {
                path: 'subscriptions',
                component: SubsPageComponent,
                canActivate: [AuthGuard],
            },
            {
                path: 'saved',
                component: SavedPageComponent,
                canActivate: [AuthGuard],
            },
            { path: 'post/:title', component: PostPageComponent },
            { path: 'author/:username', component: AuthorPageComponent },
            {
                path: 'authentication',
                component: AuthPageComponent,
                canActivate: [AuthGuard],
            },
            {
                path: 'profile',
                loadChildren: () =>
                    import('./user-panel/user-panel.module').then(
                        (m) => m.UserPanelModule
                    ),
                canActivateChild: [AuthGuard],
            },
        ],
    },
    {
        path: '**',
        redirectTo: '/',
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
