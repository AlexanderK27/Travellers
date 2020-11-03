import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from 'src/app/shared/shared.module';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { AuthPageComponent } from './auth-page.component';
import { LoginFormComponent } from './login-form/login-form.component';
import { SignupFormComponent } from './signup-form/signup-form.component';

@NgModule({
    declarations: [AuthPageComponent, LoginFormComponent, SignupFormComponent],
    imports: [CommonModule, SharedModule, AppRoutingModule],
})
export class AuthPageModule {}
