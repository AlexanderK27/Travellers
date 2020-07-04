import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/shared/services/user.service';
import { Subscription } from 'rxjs';
import { UserData, ProfileData } from 'src/app/shared/interfaces';

@Component({
    selector: 'app-profile-page',
    templateUrl: './profile-page.component.html',
    styleUrls: ['./profile-page.component.scss']
})
export class ProfilePageComponent implements OnInit {
    user: UserData
    userSub: Subscription

    constructor(
        private userService: UserService
    ) {
        this.userSub = this.userService.userData$.subscribe(user => {
            this.user = user
        })
    }

    ngOnInit(): void {
    }

}
