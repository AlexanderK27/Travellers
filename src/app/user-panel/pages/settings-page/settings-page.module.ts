import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { SharedModule } from "src/app/shared/shared.module";
import { AvatarSectionComponent } from "./sections/avatar-section/avatar-section.component";
import { DeleteSectionComponent } from "./sections/delete-section/delete-section.component";
import { EmailSectionComponent } from "./sections/email-section/email-section.component";
import { PasswordSectionComponent } from "./sections/password-section/password-section.component";
import { ProfileSectionComponent } from "./sections/profile-section/profile-section.component";
import { SettingsPageComponent } from "./settings-page.component";
import { SettingsPageService } from "./settings-page.service";

@NgModule({
    declarations: [
        AvatarSectionComponent,
        DeleteSectionComponent,
        EmailSectionComponent,
        PasswordSectionComponent,
        ProfileSectionComponent,
        SettingsPageComponent,
    ],
    imports: [
        CommonModule,
        SharedModule
    ],
    providers: [
        SettingsPageService
    ]
})
export class SettingsPageModule {}
