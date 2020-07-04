import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserCredentials } from 'src/app/shared/interfaces';
import { AuthService } from 'src/app/shared/services/auth.service';
import { isEmail } from 'src/app/shared/services/input.validators';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent implements OnInit {
    form: FormGroup
    showPassword = false
    submitted = false

    constructor(
        private auth: AuthService,
        private userService: UserService,
        private router: Router,
    ) {}

    ngOnInit(): void {
        this.form = new FormGroup({
            email: new FormControl('', [Validators.required, isEmail, Validators.maxLength(30)]),
            password: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(30)])
        })
    }

    onMinLengthError(): string {
        const requiredLength = this.form.get('password').errors.minlength.requiredLength
        const actualLength = this.form.get('password').errors.minlength.actualLength
        return `Password should contain at least ${requiredLength} characters.
            ${requiredLength - actualLength} left`
    }

    onShowHidePassword() {
        this.showPassword = !this.showPassword
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

        this.auth.login(credentials).subscribe(response => {
            this.userService.fetchUser(response.localId).subscribe(user => {
                this.userService.userData$.next(user)
                this.form.reset()
                this.router.navigate(['/profile'])
                this.submitted = false
            }, (e) => {
                console.log(e)
            })
        }, () => {
            this.submitted = false
        })
    }

}
