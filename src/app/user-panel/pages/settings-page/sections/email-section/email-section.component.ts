import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { isEmail } from "src/app/shared/services/input.validators";
import { SettingsPageService } from "../../settings-page.service";

@Component({
    selector: 'app-email-section',
    templateUrl: './email-section.component.html',
    styleUrls: ['./email-section.component.scss', '../../settings-page.component.scss']
})
export class EmailSectionComponent implements OnInit {
    form: FormGroup;
    submitted = false;

    constructor(private settingsService: SettingsPageService) {}

    ngOnInit() {
        this.form = new FormGroup({
            email: new FormControl('', [
                Validators.required,
                isEmail,
                Validators.maxLength(30),
            ]),
        });
    }

    saveEmail() {
        if (this.form.invalid) return;

        this.submitted = true;

        const email = this.form.value.email;

        this.settingsService.saveEmail(
            email,
            () => {
                this.form.reset();
                this.submitted = false;
            },
            () => {
                this.submitted = false;
            }
        )
    }
}
