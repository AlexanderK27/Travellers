import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { UserService } from 'src/app/shared/services/user.service';
import { AvatarService } from 'src/app/shared/services/avatar.service';
import { AlertService } from 'src/app/shared/services/alert.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { PublicationService } from 'src/app/shared/services/publication.service';
import { isEmail, doPasswordsMatch } from 'src/app/shared/services/input.validators';
import { UserData, Confirmation } from 'src/app/shared/interfaces';
import { ImageSource } from 'src/app/shared/types';
import { Router } from '@angular/router';
import { mergeMap } from 'rxjs/operators';


@Component({
    selector: 'app-settings-page',
    templateUrl: './settings-page.component.html',
    styleUrls: ['./settings-page.component.scss']
})
export class SettingsPageComponent implements OnInit, OnDestroy {
    emailForm: FormGroup
    passwordForm: FormGroup
    profileDataForm: FormGroup

    avatarSub: Subscription
    deleteWindow: Confirmation = null
    minAvatarSub: Subscription
    minNewAvatar: ImageSource = ''
    newAvatar: ImageSource = ''
    profileDataChanged = false
    showPassword = false
    showConfirmPassword = false
    submitted = false
    user: UserData
    userSub: Subscription

    constructor(
        private alert: AlertService,
        private auth: AuthService,
        private avatar: AvatarService,
        private pubService: PublicationService,
        private router: Router,
        private userService: UserService
    ) {
        this.avatarSub = this.avatar.croppedAvatar$.subscribe(image => {
            if (image) this.newAvatar = image
        })
        this.minAvatarSub = this.avatar.minCroppedAvatar$.subscribe(image => {
            if (image) this.minNewAvatar = image
        })
    }

    ngOnInit(): void {
        this.userSub = this.userService.userData$.subscribe(user => {
            if (user) {
                this.user = user

                this.profileDataForm = new FormGroup({
                    name: new FormControl(user.name || '', [Validators.maxLength(30)]),
                    website: new FormControl(user.website || '', [Validators.maxLength(30)]),
                    bio: new FormControl(user.bio || '', [Validators.maxLength(70)])
                })

                this.profileDataForm.valueChanges.subscribe(value => {
                    if (
                        value.name !== this.user.name ||
                        value.website !== this.user.website ||
                        value.bio !== this.user.bio
                    ) {
                        if (this.profileDataChanged === false) {
                            this.profileDataChanged = true
                        }
                    } else {
                        this.profileDataChanged = false
                    }
                })
            }
        })
        this.emailForm = new FormGroup({
            email: new FormControl('', [Validators.required, isEmail, Validators.maxLength(30)])
        })
        this.passwordForm = new FormGroup({
            password: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(30)]),
            confirmPass: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(30)])
        }, [doPasswordsMatch])
    }

    deleteAccount() {
        this.deleteWindow = {
            confirmButtonTitle: 'Delete Account',
            text: 'Are you sure you want to delete account?\nThere is no way back.\nAll your publications will be deleted!',
            callback: () => {
                this.auth.deleteAccount().subscribe(() => {
                    this.pubService.deletePublications().pipe(
                        mergeMap(() => this.userService.deleteUser())
                    ).subscribe(() => {
                        this.alert.success('Your account has been deleted')
                        this.auth.logout()
                        this.router.navigate(['/authentication'])
                    })
                })
            }
        }
    }

    closeDeleteWindow() {
        this.deleteWindow = null
    }

    onMinLengthError(controlName: string): string {
        const requiredLength = this.passwordForm.get(controlName).errors.minlength.requiredLength
        const actualLength = this.passwordForm.get(controlName).errors.minlength.actualLength
        return `Password must contain at least ${requiredLength} characters.
            ${requiredLength - actualLength} left`
    }

    onShowHidePassword(passwordStateName: 'showPassword' | 'showConfirmPassword'): boolean {
        return this[passwordStateName] = !this[passwordStateName]
    }

    saveAvatar() {
        if (!this.newAvatar || !this.minNewAvatar) {
            return
        }

        this.submitted = true

        const avatar = {
            avatar: this.newAvatar,
            minAvatar: this.minNewAvatar
        }

        this.userService.updateProfile(avatar).subscribe(() => {
            this.userService.userData$.next({
                ...this.user,
                ...avatar
            })
            this.showAlert()
        }, () => {
            this.showAlert('', 'Something went wrong')
        }, () => {
            this.submitted = false
        })
    }

    saveEmail() {
        if (this.emailForm.invalid) {
            return
        }

        this.submitted = true

        this.auth.updateEmailOrPassword({email: this.emailForm.value.email}).subscribe(() => {
            this.emailForm.reset()
            this.showAlert('Email has been changed')
            this.submitted = false
        }, () => {
            this.submitted = false
        })
    }

    savePassword() {
        if (this.passwordForm.invalid) {
            return
        }

        this.submitted = true

        this.auth.updateEmailOrPassword({password: this.passwordForm.value.password}).subscribe(() => {
            this.passwordForm.reset()
            this.showAlert('Password has been changed')
            this.submitted = false
        }, () => {
            this.submitted = false
        })
    }

    saveProfileData() {
        if (this.profileDataForm.invalid) {
            return
        }

        this.submitted = true

        const profileData = {
            name: this.profileDataForm.value.name,
            website: this.profileDataForm.value.website,
            bio: this.profileDataForm.value.bio
        }

        this.userService.updateProfile(profileData).subscribe(() => {
            this.userService.userData$.next({
                ...this.user,
                ...profileData
            })
            this.showAlert()
        }, () => {
            this.showAlert('','Something went wrong')
        }, () => {
            this.submitted = false
        })
    }

    private showAlert(message: string = 'Changes have been saved', error?: string) {
        if (error) {
            this.alert.danger(error)
        } else {
            this.alert.success(message)
        }
    }

    ngOnDestroy(): void {
        this.avatarSub.unsubscribe()
        this.minAvatarSub.unsubscribe()
        this.userSub.unsubscribe()
    }

}
