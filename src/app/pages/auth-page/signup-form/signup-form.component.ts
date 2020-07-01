import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserCredentials } from 'src/app/shared/interfaces';
import { AuthService } from 'src/app/shared/services/auth.service';
import { isEmail } from 'src/app/shared/services/input.validators';

@Component({
  selector: 'app-signup-form',
  templateUrl: './signup-form.component.html',
  styleUrls: ['./signup-form.component.scss']
})
export class SignupFormComponent implements OnInit {
    form: FormGroup
    submitted = false

    constructor(
        private auth: AuthService,
        private router: Router
    ) {}

    ngOnInit(): void {
        this.form = new FormGroup({
            email: new FormControl('', [Validators.required, isEmail]),
            password: new FormControl('', [Validators.required, Validators.minLength(8)])
        })
    }

    onMinLengthError(): string {
        const requiredLength = this.form.get('password').errors.minlength.requiredLength
        const actualLength = this.form.get('password').errors.minlength.actualLength
        return `Password should contain at least ${requiredLength} characters.
            ${requiredLength - actualLength} left`
    }

    onSubmit() {
        if (this.form.invalid) {
            return
        }

        this.submitted = true

        const credentials: UserCredentials = {
            email: this.form.value.email,
            password: this.form.value.password
        }

        this.auth.signup(credentials).subscribe(() => {
            this.form.reset()
            this.router.navigate(['/profile'])
            this.submitted = false
        }, () => {
            this.submitted = false
        })
    }
}
