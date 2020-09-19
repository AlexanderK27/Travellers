import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Confirmation } from '../../interfaces';

@Component({
    selector: 'app-confirm-window',
    templateUrl: './confirm-window.component.html',
    styleUrls: ['./confirm-window.component.scss'],
})
export class ConfirmWindowComponent {
    @Input() settings: Confirmation;
    @Output() onClose: EventEmitter<any> = new EventEmitter<any>();

    cancel() {
        this.onClose.emit();
    }
    confirm() {
        this.settings.callback();
    }
}
