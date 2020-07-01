import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-user-panel-layout',
  templateUrl: './user-panel-layout.component.html',
  styleUrls: ['./user-panel-layout.component.scss']
})
export class UserPanelLayoutComponent implements OnInit {

    constructor(
        private auth: AuthService,
        private router: Router
    ) {}

    ngOnInit(): void {}

    onLogOut() {
        this.auth.logout()
        this.router.navigate(['/authentication'])
    }
}
