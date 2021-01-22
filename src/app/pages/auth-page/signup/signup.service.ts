import { Injectable } from "@angular/core";
import { AbstractControl } from "@angular/forms";
import { of } from "rxjs";
import { delay, finalize, map, switchMap } from "rxjs/operators";
import { AuthService } from "src/app/shared/services/auth/auth.service";
import { UserService } from "src/app/shared/services/user/user.service";
import { IUserBasicProfileData, IUserCredentials } from "src/app/shared/services/user/user.interfaces";

@Injectable()
export class SignupService {
    username = '';

    constructor(
        private authService: AuthService,
        private userService: UserService
    ) {}

    isUsernameTaken = (control: AbstractControl) => {
        return of(control.value).pipe(
            delay(300),
            switchMap(value => this.authService.isUsernameTaken(value)),
            map(result => result ? { usernameTaken: result } : null),
            finalize(() => control.markAsTouched())
        )
    }

    registrateNewUser(credentials: IUserCredentials, onSuccess: VoidFunction, onError: VoidFunction) {
        const signupData = {
            ...credentials,
            username: this.username
        }

        this.authService.signup(signupData).subscribe(user => {
            this.username = '';
            this.userService.userData$.next(user);
            onSuccess()
        }, (e) => {
            onError()
        })
    }

    saveProfileData(profile: IUserBasicProfileData, onSuccess: VoidFunction, onError: VoidFunction) {
        this.userService.updateProfile(profile).subscribe(avatarFileName => {
            const user = this.userService.userData$.getValue();

            this.userService.userData$.next({
                ...user,
                ...profile,
                avatar: avatarFileName
            });

            onSuccess();
        }, (e) => {
            onError();
        });
    }

    setUsername(username: string) {
        this.username = username;
    }
}
