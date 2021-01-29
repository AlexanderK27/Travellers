import { Component, Input, Output, EventEmitter } from '@angular/core';

export interface IConfirmWindow {
    confirmBtnText: string;
    doOnConfirm: () => void;
    message: string;

    cancelBtnText?: string;
}

@Component({
    selector: 'app-confirm-window',
    templateUrl: './confirm-window.component.html',
    styleUrls: ['./confirm-window.component.scss'],
})
export class ConfirmWindowComponent {
    @Input() settings: IConfirmWindow;
    @Output() close: EventEmitter<true> = new EventEmitter<true>();

    cancel() {
        this.close.emit(true);
    }
    confirm() {
        this.settings.doOnConfirm();
    }
}
