import { Component, Input } from "@angular/core";

@Component({
    selector: 'app-check-loader',
    template: `
        <div class="circle-loader" [class.load-complete]="complete">
            <div class="checkmark draw"></div>
        </div>
    `,
    styleUrls: ['./check-loader.component.scss']
})
export class CheckLoader {
    @Input() complete: boolean;

    constructor() {}
}
