import { Component, OnInit } from '@angular/core';
import { UserService } from './shared/services/user.service';
import { AuthService } from './shared/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

    constructor(
        private auth: AuthService,
        private userService: UserService
    ) {}

    ngOnInit() {
        const userId = localStorage.getItem('userId')
        if (userId) {
            if (this.auth.isAuthenticated()) {
                this.userService.fetchUser(userId).subscribe(user => {
                    this.userService.userData$.next(user)
                }, (e) => {
                    console.log(e)
                })
            }
        } else {
            this.auth.logout()
        }
    }
}
