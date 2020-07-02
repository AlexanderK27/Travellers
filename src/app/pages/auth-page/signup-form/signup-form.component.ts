import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserCredentials } from 'src/app/shared/interfaces';
import { AuthService } from 'src/app/shared/services/auth.service';
import { isEmail, doPasswordsMatch } from 'src/app/shared/services/input.validators';

@Component({
  selector: 'app-signup-form',
  templateUrl: './signup-form.component.html',
  styleUrls: ['./signup-form.component.scss']
})
export class SignupFormComponent implements OnInit {
    signUpForm: FormGroup // registers user by email and password
    profileDataForm: FormGroup // save user's profile data to a realtime database

    showPasswordValue = false
    showConfirmPassValue = false
    submitted = false

    constructor(
        private auth: AuthService,
        private router: Router
    ) {}

    ngOnInit(): void {
        this.signUpForm = new FormGroup({
            email: new FormControl('', [Validators.required, isEmail, Validators.maxLength(30)]),
            password: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(30)]),
            confirmPass: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(30)])
        }, [doPasswordsMatch])
    }

    onMinLengthError(controlName: string): string {
        const requiredLength = this.signUpForm.get(controlName).errors.minlength.requiredLength
        const actualLength = this.signUpForm.get(controlName).errors.minlength.actualLength
        return `Password should contain at least ${requiredLength} characters.
            ${requiredLength - actualLength} left`
    }

    onShowHidePassword(passwordStateName: 'showPasswordValue' | 'showConfirmPassValue'): boolean {
        return this[passwordStateName] = !this[passwordStateName]
    }

    onSubmit() {
        if (this.signUpForm.invalid) {
            return
        }

        this.submitted = true

        const credentials: UserCredentials = {
            email: this.signUpForm.value.email,
            password: this.signUpForm.value.password
        }

        this.auth.signup(credentials).subscribe(() => {
            this.signUpForm.reset()
            this.router.navigate(['/profile'])
            this.submitted = false
        }, () => {
            this.submitted = false
        })
    }
}
