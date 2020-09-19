import { Location } from '@angular/common';
import {
    Component,
    OnInit,
    HostListener,
    ViewChild,
    ElementRef,
} from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { ImageSource } from '../img-picker/image-picker.service';

type FooterType = 'large' | 'small';

@Component({
    selector: 'app-main-layout',
    templateUrl: './main-layout.component.html',
    styleUrls: ['./main-layout.component.scss'],
})
export class MainLayoutComponent implements OnInit {
    @ViewChild('navbar') navbarRef: ElementRef;
    footerType: FooterType = 'large';
    isNavbarFixed = false;
    lastScrollTop = 0;
    showProfileMenu = false;
    userAvatarSrc: Observable<ImageSource>;

    constructor(
        public auth: AuthService,
        private location: Location,
        private router: Router,
        private user: UserService
    ) {}

    ngOnInit(): void {
        this.userAvatarSrc = this.user.userData$.pipe(
            map((user) =>
                user && user.avatar
                    ? user.avatar
                    : '../../../../assets/avatar.jpg'
            )
        );

        this.setFooterType();

        this.location.onUrlChange(() => {
            this.setFooterType();
        });
    }

    handleProfileMenu(event?: MouseEvent) {
        this.showProfileMenu = !this.showProfileMenu;
    }

    logOut() {
        this.auth.logout();
        this.router.navigate(['/authentication']);
    }

    @HostListener('window:scroll', ['$event'])
    onWindowScroll(event: Event) {
        const navbarHeight = this.navbarRef.nativeElement.clientHeight;
        const newScrollTop = event.target['scrollingElement'].scrollTop;

        if (newScrollTop > this.lastScrollTop) {
            this.navbarRef.nativeElement.style.top = -navbarHeight + 'px';
        } else {
            this.navbarRef.nativeElement.style.top = '0px';
        }

        this.lastScrollTop = newScrollTop;
    }

    private setFooterType() {
        if (this.location.isCurrentPathEqualTo('')) {
            this.footerType = 'large';
        } else {
            this.footerType = 'small';
        }
    }
}
