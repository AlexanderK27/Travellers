import { Component } from '@angular/core';
import { Router } from '@angular/router';

export interface ISignupProcessState {
    showUsernameForm: boolean;
    showSignupForm: boolean;
    showProfileForm: boolean;
}

@Component({
    selector: 'app-signup',
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.scss'],
})
export class SignupComponent {
    formsState: ISignupProcessState = {
        showUsernameForm: true, // selects a username
        showSignupForm: false, // registers a new user
        showProfileForm: false, // saves user's profile data
    }
    showStepsSidebar = true;

    constructor(private router: Router) {}

    displayProfileForm() {
        this.formsState = {
            showUsernameForm: false,
            showSignupForm: false,
            showProfileForm: true
        }
    }

    displaySignupForm() {
        this.formsState = {
            showUsernameForm: false,
            showSignupForm: true,
            showProfileForm: false
        }
    }

    displayUsernameForm() {
        this.formsState = {
            showUsernameForm: true,
            showSignupForm: false,
            showProfileForm: false
        }
    }

    navigateToProfilePage() {
        this.router.navigate(['/profile']);
    }

    toggleStepsSidebar() {
        this.showStepsSidebar = !this.showStepsSidebar;
    }
}
