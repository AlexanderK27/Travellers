import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
    selector: 'app-auth-page',
    templateUrl: './auth-page.component.html',
    styleUrls: ['./auth-page.component.scss']
})
export class AuthPageComponent implements OnInit {
    formType: string

    constructor(
        private route: ActivatedRoute
    ) {}

    ngOnInit(): void {
        this.route.queryParams.subscribe((params: Params) => {
            if (params['newMember'] === 'true') {
                this.formType = 'registration'
            } else {
                this.formType = 'loggingIn'
            }
        })
    }
}
