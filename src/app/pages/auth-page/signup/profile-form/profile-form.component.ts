import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ImagePickerService } from "src/app/shared/components/img-picker/image-picker.service";
import { SignupService } from "../signup.service";

@Component({
    selector: 'app-profile-form',
    templateUrl: './profile-form.component.html',
    styleUrls: ['./profile-form.component.scss', '../signup.component.scss']
})
export class ProfileFormComponent implements OnInit {
    @Output() profileUpdated: EventEmitter<true> = new EventEmitter<true>();
    @Output() skip: EventEmitter<true> = new EventEmitter<true>();

    form: FormGroup
    submitted = false;

    constructor(
        public pickerService: ImagePickerService,
        private signupService: SignupService
    ) {}

    ngOnInit() {
        this.form = new FormGroup({
            real_name: new FormControl('', [Validators.maxLength(30)]),
            contact: new FormControl('', [Validators.maxLength(30)]),
            bio: new FormControl('', [Validators.maxLength(150)]),
        });
    }

    skipEnteringProfileData() {
        this.skip.emit();
    }

    saveProfileData() {
        if (this.form.invalid) return;

        this.submitted = true;

        const profile = {
            real_name: this.form.value.real_name,
            contact: this.form.value.contact,
            bio: this.form.value.bio,
            avatar: this.pickerService.getCroppedImage()
        };

        this.signupService.saveProfileData(
            profile,
            () => {
                this.form.reset();
                this.pickerService.resetImage();
                this.submitted = false;
                this.profileUpdated.emit();
            },
            () => {
                this.pickerService.resetImage();
                this.submitted = false;
            }
        )
    }
}
