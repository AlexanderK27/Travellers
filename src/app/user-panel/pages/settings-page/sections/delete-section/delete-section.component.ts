import { Component } from "@angular/core";
import { SettingsPageService } from "../../settings-page.service";

@Component({
    selector: 'app-delete-section',
    templateUrl: './delete-section.component.html',
    styleUrls: ['./delete-section.component.scss', '../../settings-page.component.scss']
})
export class DeleteSectionComponent {

    constructor(private settingsService: SettingsPageService) {}

    delete() {
        const button = 'Delete Account'
        const message = 'Are you sure you want to delete account?'
            + '\nThere is no way back.'
            + '\nAll your posts will be deleted!';

        this.settingsService.confirmWindow$.next({
            confirmBtnText: button,
            doOnConfirm: () => this.settingsService.deleteProfile(),
            message
        })
    }
}
