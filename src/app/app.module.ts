import { NgModule, Provider } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from './shared/shared.module';
import { AuthPageModule } from './pages/auth-page/auth-page.module';
import { HomePageModule } from './pages/home-page/home-page.module';
import { PlanPageModule } from './pages/plan-page/plan-page.module';
import { AppComponent } from './app.component';
import { SubsPageComponent } from './pages/subs-page/subs-page.component';
import { SavedPageComponent } from './pages/saved-page/saved-page.component';
import { AuthInterceptor } from './shared/services/auth.interceptor';
import { AuthorPageComponent } from './pages/author-page/author-page.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

const INTERCEPTOR_PROVIDER: Provider = {
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true,
};

@NgModule({
    declarations: [
        AppComponent,
        SubsPageComponent,
        SavedPageComponent,
        AuthorPageComponent,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        SharedModule,
        AuthPageModule,
        HomePageModule,
        PlanPageModule,
        ServiceWorkerModule.register('ngsw-worker.js', {
            enabled: environment.production,
        }),
    ],
    providers: [INTERCEPTOR_PROVIDER],
    bootstrap: [AppComponent],
})
export class AppModule {}
