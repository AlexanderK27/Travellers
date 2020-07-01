import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss']
})
export class MainLayoutComponent implements OnInit {
    isLoggedIn: boolean

    constructor(private auth: AuthService) {
        this.auth.showProfile$.subscribe(arg => this.isLoggedIn = arg);
    }

    ngOnInit(): void {
    }
}
