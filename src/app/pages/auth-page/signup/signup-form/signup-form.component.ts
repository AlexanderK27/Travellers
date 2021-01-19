import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { doPasswordsMatch, isEmail } from "src/app/shared/services/input.validators";
import { IUserCredentials } from "src/app/shared/services/user/user.interfaces";
import { SignupService } from "../signup.service";

@Component({
    selector: 'app-signup-form',
    templateUrl: './signup-form.component.html',
    styleUrls: ['./signup-form.component.scss', '../signup.component.scss']
})
export class SignupFormComponent implements OnInit {
    @Output() goBack: EventEmitter<true> = new EventEmitter<true>();
    @Output() userRegistered: EventEmitter<true> = new EventEmitter<true>();

    form: FormGroup
    showPasswordValue = false;
    showCPasswordValue = false;
    submitted = false;

    constructor(private signupService: SignupService) {}

    ngOnInit() {
        this.form = new FormGroup(
            {
                email: new FormControl('', [
                    Validators.required,
                    isEmail,
                    Validators.maxLength(30),
                ]),
                password: new FormControl('', [
                    Validators.required,
                    Validators.minLength(8),
                    Validators.maxLength(30),
                ]),
                confirmPass: new FormControl('', [
                    Validators.required,
                    Validators.minLength(8),
                    Validators.maxLength(30),
                ]),
            },
            [doPasswordsMatch]
        );
    }

    backToUsername() {
        this.goBack.emit(true)
    }

    onMinLengthError(controlName: string): string {
        const requiredLength = this.form.get(controlName).errors.minlength
            .requiredLength;
        const actualLength = this.form.get(controlName).errors.minlength
            .actualLength;
        return `Password must contain at least ${requiredLength} characters.
            ${requiredLength - actualLength} left`;
    }

    onSubmit() {
        if (this.form.invalid) return;

        this.submitted = true;

        const credentials: IUserCredentials = {
            email: this.form.value.email,
            password: this.form.value.password
        }

        this.signupService.registrateNewUser(
            credentials,
            () => {
                this.form.reset()
                this.submitted = false;
                this.userRegistered.emit()
            },
            () => {
                this.submitted = false;
            }
        )
    }

    showHidePassword(passwordStateName: 'showPasswordValue' | 'showCPasswordValue'): boolean {
        return (this[passwordStateName] = !this[passwordStateName]);
    }
}
