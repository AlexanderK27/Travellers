import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { SignupService } from "../signup.service";

@Component({
    selector: 'app-username-form',
    templateUrl: './username-form.component.html',
    styleUrls: ['./username-form.component.scss', '../signup.component.scss']
})
export class UsernameFormComponent implements OnInit {
    @Output() usernameSelected: EventEmitter<true> = new EventEmitter<true>();

    form: FormGroup
    submitted = false;

    constructor(private signupService: SignupService) {}

    ngOnInit() {
        this.form = new FormGroup({
            username: new FormControl(
                this.signupService.username,
                [
                    Validators.required,
                    Validators.pattern('[a-zA-Z0-9_]*'),
                    Validators.minLength(3),
                    Validators.maxLength(20),
                ],
                [this.signupService.isUsernameTaken]
            ),
        });
    }

    onSubmit(value: string) {
        if (this.form.valid) {
            this.signupService.setUsername(value);
            this.usernameSelected.next()
        }
    }
}
