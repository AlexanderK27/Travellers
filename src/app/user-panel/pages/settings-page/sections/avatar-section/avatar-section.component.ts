import { Component, Input } from "@angular/core";
import { ImagePickerService } from "src/app/shared/components/img-picker/image-picker.service";
import { SettingsPageService } from "../../settings-page.service";

@Component({
    selector: 'app-avatar-section',
    templateUrl: './avatar-section.component.html',
    styleUrls: ['./avatar-section.component.scss', '../../settings-page.component.scss']
})
export class AvatarSectionComponent {
    @Input() avatar: string;
    submitted = false;

    constructor(
        public picker: ImagePickerService,
        private settingsService: SettingsPageService
    ) {}

    saveAvatar() {
        this.submitted = true;

        const avatar = this.picker.getCroppedImage()

        if (avatar) {
            this.settingsService.saveAvatar(
                avatar,
                () => {
                    this.picker.resetImage();
                    this.submitted = false;
                },
                () => {
                    this.picker.resetImage();
                    this.submitted = false;
                }
            );
        } else {
            this.submitted = false;
        }
    }
}
