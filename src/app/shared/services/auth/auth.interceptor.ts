import { Injectable } from '@angular/core';
import {
    HttpInterceptor,
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpErrorResponse,
} from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { AlertService } from '../alert.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(
        private auth: AuthService,
        private router: Router,
        private alert: AlertService
    ) {}

    intercept(
        req: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        return next.handle(req).pipe(
            catchError((error: HttpErrorResponse) => {
                if (error.status === 401) {
                    this.auth.logout();

                    if (this.router.url.startsWith('/profile')) {
                        this.router.navigate(['/authentication']);
                        this.alert.danger('Session expired, please re-sign in')
                    }
                }
                return throwError(error);
            })
        );
    }
}
