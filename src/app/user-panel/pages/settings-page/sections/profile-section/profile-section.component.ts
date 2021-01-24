import { Component, Input, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { SettingsPageService } from "../../settings-page.service";

export interface IProfileData {
    bio: string;
    contact: string;
    real_name: string;
}

@Component({
    selector: 'app-profile-section',
    templateUrl: './profile-section.component.html',
    styleUrls: ['./profile-section.component.scss', '../../settings-page.component.scss']
})
export class ProfileSectionComponent implements OnInit {
    @Input() bio: string;
    @Input() contact: string;
    @Input() real_name: string;

    dataChanged = false;
    form: FormGroup;
    submitted = false;

    constructor(private settingsService: SettingsPageService) {}

    ngOnInit() {
        this.form = new FormGroup({
            real_name: new FormControl(this.real_name || '', [
                Validators.maxLength(30),
            ]),
            contact: new FormControl(this.contact || '', [
                Validators.maxLength(30),
            ]),
            bio: new FormControl(this.bio || '', [
                Validators.maxLength(150),
            ]),
        });

        this.form.valueChanges.subscribe((value) => {
            if (
                value.real_name !== this.real_name
                 || value.contact !== this.contact
                 || value.bio !== this.bio
            ) {
                if (this.dataChanged === false) this.dataChanged = true;
            } else {
                if (this.dataChanged === true) this.dataChanged = false;
            }
        });
    }

    saveChanges() {
        if (this.form.invalid) return;

        this.submitted = true;

        const profile: IProfileData = {
            real_name: this.form.value.real_name,
            contact: this.form.value.contact,
            bio: this.form.value.bio,
        };

        this.settingsService.saveProfileData(
            profile,
            () => {
                this.submitted = false;
            },
            () => {
                this.submitted = false;
            })
    }
}
