import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { Location } from '@angular/common';
import { switchMap } from 'rxjs/operators';

import { UserService } from 'src/app/shared/services/user/user.service';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { AlertService } from 'src/app/shared/services/alert.service';
import { IAuthorProfileData } from 'src/app/shared/services/user/user.interfaces';
import { IPostCard } from 'src/app/shared/services/post/post.interfaces';

@Component({
    selector: 'app-author-page',
    templateUrl: './author-page.component.html',
    styleUrls: ['./author-page.component.scss'],
})
export class AuthorPageComponent implements OnInit {
    author: IAuthorProfileData;
    posts: IPostCard[] = [];

    followBtnPressed = false;
    loading = true;

    authorNameValue = '';
    notFoundAuthor = '';

    author_username: string;
    user_username: string;

    constructor(
        private auth: AuthService,
        private alert: AlertService,
        private location: Location,
        private route: ActivatedRoute,
        private title: Title,
        private userService: UserService
    ) {}

    ngOnInit(): void {
        // this.route.params.pipe(switchMap(({ username }: Params) => {
        //     this.author_username = username;

        //     this.title.setTitle(`${username} | Author Profile • Travellers`);

        //     return this.userService.fetchAuthor(username);
        // })).subscribe(res => {
        //     const { profile, posts } = res.payload;

        //     profile.username = this.author_username;
        //     profile.posts = posts.length;
        //     profile.avatar = profile.avatar
        //         ? '/api/image/poster/' + profile.avatar
        //         : '../../../../assets/avatar.jpg';

        //     this.author = profile;

        //     let saved_posts = [];
        //     const user = this.userService.userData$.getValue();

        //     if (user) {
        //         saved_posts = user.saved_posts
        //         this.user_username = user.username
        //     }

        //     this.posts = posts.map(post => {
        //         return {
        //             ...post,
        //             author_avatar: profile.avatar,
        //             author_name: profile.username,
        //             isSaved: saved_posts.includes(post.post_id)
        //         }
        //     })

        //     this.loading = false;
        // }, (error) => {
        //     if (error.status === 404) {
        //         this.notFoundAuthor = this.author_username;
        //         this.loading = false;
        //     } else {
        //         this.alert.danger(error.error.error);
        //     }
        // })
        this.route.params.subscribe(({ username }: Params) => {
            this.author_username = username;

            this.title.setTitle(`${username} | Author Profile • Travellers`);

            this.fetchAuthor(username)
        })
    }

    fetchAuthor(username: string) {
        this.loading = true;
        this.notFoundAuthor = '';

        this.userService.fetchAuthor(username).subscribe(res => {
            const { profile, posts } = res.payload;

            profile.username = this.author_username;
            profile.posts = posts.length;
            profile.avatar = profile.avatar
                ? '/api/image/avatar/' + profile.avatar
                : '../../../../assets/avatar.jpg';

            this.author = profile;

            let saved_posts = [];
            const user = this.userService.userData$.getValue();

            if (user) {
                saved_posts = user.saved_posts
                this.user_username = user.username
            }

            this.posts = posts.map(post => {
                return {
                    ...post,
                    author_avatar: profile.avatar,
                    author_name: profile.username,
                    isSaved: saved_posts.includes(post.post_id)
                }
            })

            this.loading = false;
        }, (error) => {
            if (error.status === 404) {
                this.notFoundAuthor = this.author_username;
                this.loading = false;
            } else {
                this.alert.danger(error.error.error);
            }
        })
    }

    followAuthor() {
        if (this.auth.isAuthenticated()) {

            this.followBtnPressed = true;

            this.userService.follow(this.author_username).subscribe(() => {
                const iFollow = this.author.iFollow
                const user = this.userService.userData$.getValue();

                if (iFollow) {
                    this.author.followers--;
                    this.author.iFollow = false;
                    user.followings--;
                } else {
                    this.author.followers++;
                    this.author.iFollow = true;
                    user.followings++
                }

                this.userService.userData$.next({...user})

                this.followBtnPressed = false;
            }, (e) => {});
        } else {
            this.alert.warning('Please authorize');
        }
    }

    navigateBack() {
        this.location.back();
    }
}
