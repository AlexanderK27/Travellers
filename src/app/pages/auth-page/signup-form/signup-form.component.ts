import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators, AsyncValidatorFn } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription, timer, Observable } from 'rxjs';
import { UserCredentials, UserData } from 'src/app/shared/interfaces';
import { AuthService } from 'src/app/shared/services/auth.service';
import { UserService } from 'src/app/shared/services/user.service';
import { isEmail, doPasswordsMatch } from 'src/app/shared/services/input.validators';
import { AvatarService } from 'src/app/shared/services/avatar.service';
import { ImageSource } from 'src/app/shared/types'
import { AlertService } from 'src/app/shared/services/alert.service';
import { map, mergeMap, switchMap } from 'rxjs/operators';

@Component({
    selector: 'app-signup-form',
    templateUrl: './signup-form.component.html',
    styleUrls: ['./signup-form.component.scss']
})
export class SignupFormComponent implements OnInit, OnDestroy {
    usernameForm: FormGroup // creates username
    signUpForm: FormGroup // registers a user
    profileDataForm: FormGroup // saves user's additional profile data

    avatarSub: Subscription
    minAvatarSub: Subscription
    minNewAvatar: ImageSource = ''
    newAvatar: ImageSource = ''
    newUserRegistered = false
    showPasswordValue = false
    showConfirmPassValue = false
    submitted = false
    userData: UserData
    usernameChoosed = false
    userSub: Subscription

    constructor(
        private alert: AlertService,
        private auth: AuthService,
        private avatar: AvatarService,
        private user: UserService,
        private router: Router
    ) {}

    ngOnInit(): void {
        this.avatarSub = this.avatar.croppedAvatar$.subscribe(image => {
            if (image) this.newAvatar = image
        })
        this.minAvatarSub = this.avatar.minCroppedAvatar$.subscribe(image => {
            if (image) this.minNewAvatar = image
        })
        this.userSub = this.user.userData$.subscribe(data => {
            this.userData = data
        })
        this.usernameForm = new FormGroup({
            username: new FormControl('', [
                Validators.required,
                Validators.pattern('[a-zA-Z0-9_]*'),
                Validators.minLength(3),
                Validators.maxLength(20)
            ], [this.usernameExists(this.user)])
        }),
        this.signUpForm = new FormGroup({
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

    backToUsername() {
        this.usernameChoosed = false
    }

    onMinLengthError(controlName: string): string {
        const requiredLength = this.signUpForm.get(controlName).errors.minlength.requiredLength
        const actualLength = this.signUpForm.get(controlName).errors.minlength.actualLength
        return `Password must contain at least ${requiredLength} characters.
            ${requiredLength - actualLength} left`
    }

    showHidePassword(passwordStateName: 'showPasswordValue' | 'showConfirmPassValue'): boolean {
        return this[passwordStateName] = !this[passwordStateName]
    }

    registrateNewUser() {
        if (this.signUpForm.invalid) {
            return
        }

        this.submitted = true

        const credentials: UserCredentials = {
            email: this.signUpForm.value.email,
            password: this.signUpForm.value.password
        }

        const username = this.usernameForm.value.username

        this.user.getAuthor(username).subscribe(response => {
            if (Object.values(response).length) {
                this.alert.danger(`Username "${username}" has just been taken by another user :(`)
                this.usernameChoosed = false
                this.submitted = false
            } else {
                this.auth.signup(credentials).subscribe(response => {
                    const userData: UserData = {
                        userId: response.localId,
                        username
                    }

                    this.auth.createUser(userData).subscribe(() => {
                        this.user.userData$.next(userData)
                        this.alert.success('User created')
                        this.signUpForm.reset()
                        this.submitted = false
                        this.newUserRegistered = true
                    })
                }, () => {
                    this.submitted = false
                })
            }
        })
    }

    saveProfileData() {
        if (this.profileDataForm.invalid) {
            return
        }

        this.submitted = true

        const updatedProfile = {
            name: this.profileDataForm.value.name,
            website: this.profileDataForm.value.website,
            bio: this.profileDataForm.value.bio,
            avatar: this.newAvatar,
            minAvatar: this.minNewAvatar
        }

        this.user.updateProfile(updatedProfile).pipe(
            mergeMap(() => this.avatar.saveMinAvatar(this.userData.username, updatedProfile.minAvatar))
        ).subscribe(() => {
            const updatedUserData = { ...this.userData, ...updatedProfile }
            this.user.userData$.next(updatedUserData)
            this.avatar.addAvatarsToAvStream([{
                username: this.userData.username,
                avatar: updatedProfile.minAvatar
            }])
            this.alert.success('Profile updated')
            this.router.navigate(['/profile'])
        }, () => {
            this.submitted = false
        })
    }

    setUsername() {
        this.usernameChoosed = true
    }

    skipEnteringProfileData() {
        this.router.navigate(['/profile'])
    }

    usernameExists(user: UserService): AsyncValidatorFn {
        return (control: FormControl): Observable<{[key: string]: boolean}> => {
            return timer(500).pipe(
                switchMap(() => user.getAuthor(control.value)),
                map(username => Object.values(username).length ? {usernameExists: true} : null)
            )
        }
    }

    ngOnDestroy() {
        this.avatarSub.unsubscribe()
        this.minAvatarSub.unsubscribe()
        this.userSub.unsubscribe()
    }
}
