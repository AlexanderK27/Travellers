import { Component, Input } from '@angular/core';
import { ISignupProcessState } from '../signup.component';

@Component({
    selector: 'app-signup-steps',
    templateUrl: './signup-steps.component.html',
    styleUrls: ['./signup-steps.component.scss', '../signup.component.scss']
})
export class SignupStepsComponent {
    @Input() state: ISignupProcessState;

    constructor() {}

    stepItemStateHandler(event: MouseEvent) {
        const parentClass = event.target['parentNode'].classList;

        if (parentClass.contains('closed')) {
            parentClass.remove('closed');
        } else {
            parentClass.add('closed');
        }
    }
}
