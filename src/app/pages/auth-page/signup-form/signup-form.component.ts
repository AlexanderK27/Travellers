import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserCredentials, UserData } from 'src/app/shared/interfaces';
import { AuthService } from 'src/app/shared/services/auth.service';
import { UserService } from 'src/app/shared/services/user.service';
import { isEmail, doPasswordsMatch } from 'src/app/shared/services/input.validators';
import { AvatarService } from 'src/app/shared/services/avatar.service';
import { ImageSource } from 'src/app/shared/types'
import { AlertService } from 'src/app/shared/services/alert.service';

@Component({
    selector: 'app-signup-form',
    templateUrl: './signup-form.component.html',
    styleUrls: ['./signup-form.component.scss']
})
export class SignupFormComponent implements OnInit, OnDestroy {
    signUpForm: FormGroup // registers a user
    profileDataForm: FormGroup // saves user's additional profile data

    avatarSub: Subscription
    newAvatar: ImageSource = ''
    newUserRegistered = false
    showPasswordValue = false
    showConfirmPassValue = false
    submitted = false
    userData: UserData
    userSub: Subscription

    constructor(
        private alert: AlertService,
        private auth: AuthService,
        private avatar: AvatarService,
        private user: UserService,
        private router: Router
    ) {
        this.avatarSub = this.avatar.croppedAvatar$.subscribe(image => {
            if (image) this.newAvatar = image
        })
        this.userSub = this.user.userData$.subscribe(data => {
            this.userData = data
        })
    }

    ngOnInit(): void {
        this.signUpForm = new FormGroup({
            username: new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z0-9._]*'), Validators.maxLength(20)]),
            email: new FormControl('', [Validators.required, isEmail, Validators.maxLength(30)]),
            password: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(30)]),
            confirmPass: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(30)])
        }, [doPasswordsMatch])
        this.profileDataForm = new FormGroup({
            name: new FormControl('', [Validators.maxLength(30)]),
            website: new FormControl('', [Validators.maxLength(30)]),
            bio: new FormControl('', [Validators.maxLength(70)])
        })
    }

    onMinLengthError(controlName: string): string {
        const requiredLength = this.signUpForm.get(controlName).errors.minlength.requiredLength
        const actualLength = this.signUpForm.get(controlName).errors.minlength.actualLength
        return `Password must contain at least ${requiredLength} characters.
            ${requiredLength - actualLength} left`
    }

    onShowHidePassword(passwordStateName: 'showPasswordValue' | 'showConfirmPassValue'): boolean {
        return this[passwordStateName] = !this[passwordStateName]
    }

    onSkipProfileData() {
        this.router.navigate(['/profile'])
    }

    onSubmitProfileData() {
        if (this.profileDataForm.invalid) {
            return
        }

        this.submitted = true

        const updatedProfile = {
            name: this.profileDataForm.value.name,
            website: this.profileDataForm.value.website,
            bio: this.profileDataForm.value.bio,
            avatar: this.newAvatar
        }

        this.user.updateProfile(updatedProfile).subscribe(() => {
            this.userData.profileData = updatedProfile
            this.user.userData$.next(this.userData)
            this.alert.success('Profile updated')
            this.profileDataForm.reset()
            console.log('All user data', this.userData)
            this.router.navigate(['/profile'])
        }, (e) => {
            console.log(e)
        }, () => {
            this.submitted = false
        })
    }

    onSubmitSigningUp() {
        if (this.signUpForm.invalid) {
            return
        }

        this.submitted = true

        const credentials: UserCredentials = {
            email: this.signUpForm.value.email,
            password: this.signUpForm.value.password
        }

        this.auth.signup(credentials).subscribe((response) => {
            const userData: UserData = {
                userId: response.localId,
                username: this.signUpForm.value.username
            }

            this.auth.createUser(userData).subscribe(() => {
                this.user.userData$.next(userData)
                this.alert.success('User created')
                this.signUpForm.reset()
                this.submitted = false
                this.newUserRegistered = true
            }, (e) => {
                console.log(e)
            })

        }, () => {
            this.submitted = false
        })
    }

    ngOnDestroy() {
        this.avatarSub.unsubscribe()
        this.userSub.unsubscribe()
    }
}
