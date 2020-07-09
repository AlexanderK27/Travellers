import { NgModule, Provider } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from './shared/shared.module';
import { AppComponent } from './app.component';
import { MainLayoutComponent } from './shared/components/main-layout/main-layout.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { SubsPageComponent } from './pages/subs-page/subs-page.component';
import { SavedPageComponent } from './pages/saved-page/saved-page.component';
import { PlanPageComponent } from './pages/plan-page/plan-page.component';
import { AuthPageComponent } from './pages/auth-page/auth-page.component';
import { LoginFormComponent } from './pages/auth-page/login-form/login-form.component';
import { SignupFormComponent } from './pages/auth-page/signup-form/signup-form.component';
import { AlertComponent } from './shared/components/alert/alert.component';
import { ImgCropperComponent } from './shared/components/img-cropper/img-cropper.component';
import { ImgPickerComponent } from './shared/components/img-picker/img-picker.component';
import { AuthInterceptor } from './shared/services/auth.interceptor';
import { AuthorPageComponent } from './pages/author-page/author-page.component';

const INTERCEPTOR_PROVIDER: Provider = {
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true
}

@NgModule({
    declarations: [
        AppComponent,
        MainLayoutComponent,
        HomePageComponent,
        SubsPageComponent,
        SavedPageComponent,
        PlanPageComponent,
        AuthPageComponent,
        LoginFormComponent,
        SignupFormComponent,
        AlertComponent,
        ImgCropperComponent,
        ImgPickerComponent,
        AuthorPageComponent,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        SharedModule
    ],
    providers: [INTERCEPTOR_PROVIDER],
    bootstrap: [AppComponent]
})
export class AppModule { }
