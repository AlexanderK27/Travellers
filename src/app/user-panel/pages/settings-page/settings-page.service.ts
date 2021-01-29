import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Subject } from "rxjs";
import { IConfirmWindow } from "src/app/shared/components/confirm-window/confirm-window.component";
import { imageSource } from "src/app/shared/components/img-picker/image-picker.service";
import { AlertService } from "src/app/shared/services/alert.service";
import { AuthService } from "src/app/shared/services/auth/auth.service";
import { UserService } from "src/app/shared/services/user/user.service";
import { IProfileData } from "./sections/profile-section/profile-section.component";

export type windowSettings = IConfirmWindow;

@Injectable()
export class SettingsPageService {
    confirmWindow$: Subject<windowSettings> = new Subject();

    constructor(
        private alert: AlertService,
        private authService: AuthService,
        private router: Router,
        private userService: UserService
    ) {}

    deleteProfile() {
        this.userService.deleteMyProfile().subscribe(() => {
            this.alert.success('Your account has been deleted');
            this.authService.logout();
            this.router.navigate(['/authentication']);
        });
    }

    saveAvatar(avatar: imageSource, onSuccess: VoidFunction, onError: VoidFunction) {
        this.userService.updateProfile({ avatar }).subscribe(avatarFileName => {
            const user = this.userService.userData$.getValue();
            this.userService.userData$.next({
                ...user,
                avatar: avatarFileName
            })

            onSuccess();
        }, (e) => {
            onError();
        })
    }

    saveEmail(email: string, onSuccess: VoidFunction, onError: VoidFunction) {
        this.userService.changeEmail(email).subscribe(() => {
            onSuccess();
        }, (e) => {
            onError();
        })
    }

    savePassword(password: string, onSuccess: VoidFunction, onError: VoidFunction) {
        this.userService.changePassword(password).subscribe(() => {
            onSuccess();
        }, (e) => {
            onError();
        })
    }

    saveProfileData(data: IProfileData, onSuccess: VoidFunction, onError: VoidFunction) {
        this.userService.updateProfile(data).subscribe(() => {
            const user = this.userService.userData$.getValue();
            this.userService.userData$.next({
                ...user,
                ...data
            })

            onSuccess();
        }, (e) => {
            onError();
        })
    }
}
