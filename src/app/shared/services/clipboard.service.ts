import { Injectable } from "@angular/core";
import { AlertService } from './alert.service';

@Injectable({ providedIn: 'root' })
export class ClipboardService {
    constructor(private alert: AlertService) {}

    copyCurrentURL(callback: () => void) {
        navigator.clipboard
            .writeText(document.location.href)
            .then(() => {
                this.alert.success('Link copied to clipboard');
            })
            .catch(() => {
                this.alert.danger('Failed to copy a link');
            })
            .finally(() => {
                callback();
            });
    }
}
