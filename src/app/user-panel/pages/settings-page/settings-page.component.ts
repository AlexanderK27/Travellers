import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { UserService } from 'src/app/shared/services/user.service';
import { AvatarService } from 'src/app/shared/services/avatar.service';
import { AlertService } from 'src/app/shared/services/alert.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { PublicationService } from 'src/app/shared/services/publication.service';
import {
    isEmail,
    doPasswordsMatch,
} from 'src/app/shared/services/input.validators';
import { UserData, Confirmation } from 'src/app/shared/interfaces';
import { Router } from '@angular/router';
import { mergeMap } from 'rxjs/operators';
import { ImagePickerService } from 'src/app/shared/components/img-picker/image-picker.service';

@Component({
    selector: 'app-settings-page',
    templateUrl: './settings-page.component.html',
    styleUrls: ['./settings-page.component.scss'],
})
export class SettingsPageComponent implements OnInit, OnDestroy {
    emailForm: FormGroup;
    passwordForm: FormGroup;
    profileDataForm: FormGroup;

    croppedAvatarSizes = [
        { width: 320, height: 320 },
        { width: 36, height: 36 },
    ];
    deleteWindow: Confirmation = null;
    profileDataChanged = false;
    showPassword = false;
    showConfirmPassword = false;
    submitted = false;
    user: UserData;
    userSub: Subscription;

    constructor(
        private alert: AlertService,
        private auth: AuthService,
        private avatar: AvatarService,
        public pickerService: ImagePickerService,
        private pubService: PublicationService,
        private router: Router,
        private userService: UserService
    ) {}

    ngOnInit(): void {
        this.userSub = this.userService.userData$.subscribe((user) => {
            if (user) {
                this.user = user;

                this.profileDataForm = new FormGroup({
                    name: new FormControl(user.name || '', [
                        Validators.maxLength(30),
                    ]),
                    website: new FormControl(user.website || '', [
                        Validators.maxLength(30),
                    ]),
                    bio: new FormControl(user.bio || '', [
                        Validators.maxLength(70),
                    ]),
                });

                this.profileDataForm.valueChanges.subscribe((value) => {
                    if (
                        value.name !== this.user.name ||
                        value.website !== this.user.website ||
                        value.bio !== this.user.bio
                    ) {
                        if (this.profileDataChanged === false) {
                            this.profileDataChanged = true;
                        }
                    } else {
                        this.profileDataChanged = false;
                    }
                });
            }
        });
        this.emailForm = new FormGroup({
            email: new FormControl('', [
                Validators.required,
                isEmail,
                Validators.maxLength(30),
            ]),
        });
        this.passwordForm = new FormGroup(
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

    deleteAccount() {
        this.deleteWindow = {
            confirmButtonTitle: 'Delete Account',
            text:
                'Are you sure you want to delete account?\nThere is no way back.\nAll your publications will be deleted!',
            callback: () => {
                this.auth.deleteAccount().subscribe(() => {
                    const dSub = this.pubService
                        .deletePublications()
                        .pipe(mergeMap(() => this.userService.deleteUser()))
                        .subscribe(() => {
                            this.alert.success('Your account has been deleted');
                            this.auth.logout();
                            this.router.navigate(['/authentication']);
                            dSub.unsubscribe();
                        });
                });
            },
        };
    }

    closeDeleteWindow() {
        this.deleteWindow = null;
    }

    onMinLengthError(controlName: string): string {
        const requiredLength = this.passwordForm.get(controlName).errors
            .minlength.requiredLength;
        const actualLength = this.passwordForm.get(controlName).errors.minlength
            .actualLength;
        return `Password must contain at least ${requiredLength} characters.
            ${requiredLength - actualLength} left`;
    }

    onShowHidePassword(
        passwordStateName: 'showPassword' | 'showConfirmPassword'
    ): boolean {
        return (this[passwordStateName] = !this[passwordStateName]);
    }

    saveAvatar() {
        if (
            this.pickerService.croppedImagesSrc.length <
            this.croppedAvatarSizes.length
        ) {
            return this.showAlert(
                '',
                'We could not get uploaded photo, please contact support'
            );
        }

        this.submitted = true;

        const avatar = {
            avatar: this.pickerService.croppedImagesSrc[0],
            minAvatar: this.pickerService.croppedImagesSrc[1],
        };

        this.userService
            .updateProfile(avatar)
            .pipe(
                mergeMap(() =>
                    this.avatar.saveMinAvatar(
                        this.user.username,
                        avatar.minAvatar
                    )
                )
            )
            .subscribe(
                () => {
                    this.userService.userData$.next({
                        ...this.user,
                        ...avatar,
                    });
                    this.avatar.usersAvatars$.next([
                        {
                            username: this.user.username,
                            avatar: avatar.minAvatar,
                        },
                    ]);
                    this.pickerService.resetImage();
                    this.showAlert();
                },
                () => {
                    this.showAlert('', 'Something went wrong');
                },
                () => {
                    this.submitted = false;
                }
            );
    }

    saveEmail() {
        if (this.emailForm.invalid) {
            return;
        }

        this.submitted = true;

        this.auth
            .updateEmailOrPassword({ email: this.emailForm.value.email })
            .subscribe(
                () => {
                    this.emailForm.reset();
                    this.showAlert('Email has been changed');
                    this.submitted = false;
                },
                () => {
                    this.submitted = false;
                }
            );
    }

    savePassword() {
        if (this.passwordForm.invalid) {
            return;
        }

        this.submitted = true;

        this.auth
            .updateEmailOrPassword({
                password: this.passwordForm.value.password,
            })
            .subscribe(
                () => {
                    this.passwordForm.reset();
                    this.showAlert('Password has been changed');
                    this.submitted = false;
                },
                () => {
                    this.submitted = false;
                }
            );
    }

    saveProfileData() {
        if (this.profileDataForm.invalid) {
            return;
        }

        this.submitted = true;

        const profileData = {
            name: this.profileDataForm.value.name,
            website: this.profileDataForm.value.website,
            bio: this.profileDataForm.value.bio,
        };

        this.userService.updateProfile(profileData).subscribe(
            () => {
                this.userService.userData$.next({
                    ...this.user,
                    ...profileData,
                });
                this.showAlert();
            },
            () => {
                this.showAlert('', 'Something went wrong');
            },
            () => {
                this.submitted = false;
            }
        );
    }

    private showAlert(
        message: string = 'Changes have been saved',
        error?: string
    ) {
        if (error) {
            this.alert.danger(error);
        } else {
            this.alert.success(message);
        }
    }

    ngOnDestroy(): void {
        this.userSub.unsubscribe();
    }
}
