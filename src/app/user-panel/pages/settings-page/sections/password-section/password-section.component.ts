import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { doPasswordsMatch } from "src/app/shared/services/input.validators";
import { SettingsPageService } from "../../settings-page.service";

@Component({
    selector: 'app-password-section',
    templateUrl: './password-section.component.html',
    styleUrls: ['./password-section.component.scss', '../../settings-page.component.scss']
})
export class PasswordSectionComponent implements OnInit {
    form: FormGroup;
    showPassword = false;
    showCPassword = false;
    submitted = false

    constructor(private settingsService: SettingsPageService) {}

    ngOnInit() {
        this.form = new FormGroup(
            {
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

    onMinLengthError(controlName: string): string {
        const control = this.form.get(controlName);
        const requiredLength = control.errors.minlength.requiredLength;
        const actualLength = control.errors.minlength.actualLength;

        return `Password must contain at least ${requiredLength} characters.`
                + `${requiredLength - actualLength} left`;
    }

    savePassword() {
        if (this.form.invalid) return;

        this.submitted = true;
        const password = this.form.value.password;

        this.settingsService.savePassword(
            password,
            () => {
                this.form.reset();
                this.submitted = false;
            },
            () => {
                this.submitted = false;
            }
        )
    }

    showHidePassword(passwordStateName: 'showPassword' | 'showCPassword'): boolean {
        return (this[passwordStateName] = !this[passwordStateName]);
    }
}
