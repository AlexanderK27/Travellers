import { Component, OnInit, OnDestroy } from '@angular/core';
import { Alert, AlertService } from '../../services/alert.service';
import { Subscription, timer } from 'rxjs';
import { take } from 'rxjs/operators';

@Component({
    selector: 'app-alert',
    templateUrl: './alert.component.html',
    styleUrls: ['./alert.component.scss'],
})
export class AlertComponent implements OnInit, OnDestroy {
    aSub: Subscription;
    alerts: Alert[] = [];

    constructor(private alertService: AlertService) {}

    ngOnInit(): void {
        this.aSub = this.alertService.alert$.subscribe((alert) => {
            this.alerts.push({
                text: alert.text,
                type: alert.type,
            });

            timer(3400)
                .pipe(take(1))
                .subscribe(() => {
                    this.alerts.shift();
                });
        });
    }

    ngOnDestroy(): void {
        if (this.aSub) {
            this.aSub.unsubscribe();
        }
    }
}
