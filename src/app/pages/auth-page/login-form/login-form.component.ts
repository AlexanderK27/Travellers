import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserCredentials } from 'src/app/shared/interfaces';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent implements OnInit {
    form: FormGroup
    submitted = false

    constructor(
        private auth: AuthService,
        private router: Router,
    ) {}

    ngOnInit(): void {
        this.form = new FormGroup({
            email: new FormControl('', [Validators.email, Validators.required]),
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

        this.auth.login(credentials).subscribe(() => {
            this.form.reset()
            this.router.navigate(['/profile'])
            this.submitted = false
        }, () => {
            this.submitted = false
        })
    }

}
