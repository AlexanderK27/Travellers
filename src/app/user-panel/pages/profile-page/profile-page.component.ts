import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/shared/services/user.service';
import { Subscription } from 'rxjs';
import { UserData, ProfileData, Publication } from 'src/app/shared/interfaces';
import { PublicationService } from 'src/app/shared/services/publication.service';

@Component({
    selector: 'app-profile-page',
    templateUrl: './profile-page.component.html',
    styleUrls: ['./profile-page.component.scss']
})
export class ProfilePageComponent implements OnInit {
    user: UserData
    userSub: Subscription
    publications: Array<Publication>

    constructor(
        private userService: UserService,
        private pubService: PublicationService
    ) {
        // this.userSub = this.userService.userData$.subscribe(user => {
        //     this.user = user
        // })
    }

    ngOnInit(): void {
        this.userSub = this.userService.userData$.subscribe(user => {
            this.user = user
        })
        this.pubService.getMyPublications(this.user.userId).subscribe(pubs => {
            console.log(pubs)
        })
    }

}
