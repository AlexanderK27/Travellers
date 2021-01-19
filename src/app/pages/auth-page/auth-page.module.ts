import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from 'src/app/shared/shared.module';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { AuthPageComponent } from './auth-page.component';
import { LoginFormComponent } from './login-form/login-form.component';
import { SignupComponent } from './signup/signup.component';
import { UsernameFormComponent } from './signup/username-form/username-form.component';
import { SignupFormComponent } from './signup/signup-form/signup-form.component';
import { ProfileFormComponent } from './signup/profile-form/profile-form.component';
import { SignupStepsComponent } from './signup/signup-steps/signup-steps.component';
import { SignupService } from './signup/signup.service';

@NgModule({
    declarations: [
        AuthPageComponent,
        LoginFormComponent,
        SignupComponent,
        UsernameFormComponent,
        SignupFormComponent,
        ProfileFormComponent,
        SignupStepsComponent
    ],
    imports: [
        CommonModule,
        SharedModule,
        AppRoutingModule
    ],
    providers: [
        SignupService
    ]
})
export class AuthPageModule {}
