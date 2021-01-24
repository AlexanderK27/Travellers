import { Component, OnInit, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { skipWhile } from 'rxjs/operators';
import { Observable, Subscription } from 'rxjs';
import { UserService } from 'src/app/shared/services/user/user.service';
import { SettingsPageService, windowSettings } from './settings-page.service';
import { IUserProfileData } from 'src/app/shared/services/user/user.interfaces';

@Component({
    selector: 'app-settings-page',
    templateUrl: './settings-page.component.html',
    styleUrls: ['./settings-page.component.scss'],
})
export class SettingsPageComponent implements OnInit, OnDestroy {
    confirmWindow$: Observable<windowSettings>
    user: IUserProfileData;
    userSub: Subscription;

    constructor(
        private userService: UserService,
        private settingsService: SettingsPageService,
        private title: Title
    ) {}

    ngOnInit() {
        this.userSub = this.userService.userData$
            .pipe(skipWhile(user => !user)).subscribe(user => {

                if (!this.user || this.user.username !== user.username) {
                    this.title.setTitle(`${user.username} | Settings • Travellers`);
                }

                this.user = user;
        });
        this.confirmWindow$ = this.settingsService.confirmWindow$
    }

    closeConfirmWindow() {
        this.settingsService.confirmWindow$.next(null)
    }

    ngOnDestroy() {
        this.userSub.unsubscribe();
    }
}
