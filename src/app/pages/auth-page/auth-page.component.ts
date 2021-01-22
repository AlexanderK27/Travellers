import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
    selector: 'app-auth-page',
    templateUrl: './auth-page.component.html',
    styleUrls: ['./auth-page.component.scss'],
})
export class AuthPageComponent implements OnInit {
    isRegistration: boolean;

    constructor(private route: ActivatedRoute, private title: Title) {}

    ngOnInit(): void {
        this.route.queryParams.subscribe((params: Params) => {
            if (params['newMember'] === 'true') {
                this.title.setTitle('Registration • Travellers');
                this.isRegistration = true;
            } else {
                this.title.setTitle('Signing in • Travellers');
                this.isRegistration = false;
            }
        });
    }
}
