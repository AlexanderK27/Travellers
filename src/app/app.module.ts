import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainLayoutComponent } from './shared/components/main-layout/main-layout.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { SubsPageComponent } from './pages/subs-page/subs-page.component';
import { SavedPageComponent } from './pages/saved-page/saved-page.component';
import { PlanPageComponent } from './pages/plan-page/plan-page.component';
import { AuthPageComponent } from './pages/auth-page/auth-page.component';

@NgModule({
    declarations: [
        AppComponent,
        MainLayoutComponent,
        HomePageComponent,
        SubsPageComponent,
        SavedPageComponent,
        PlanPageComponent,
        AuthPageComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
