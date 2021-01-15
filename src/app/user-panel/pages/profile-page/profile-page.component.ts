import { Component, OnInit, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { skipWhile, switchMap } from 'rxjs/operators';
import { Subscription, EMPTY } from 'rxjs';

import { UserService } from 'src/app/shared/services/user/user.service';
import { PostService } from 'src/app/shared/services/post/post.service';
import { IPostCard } from 'src/app/shared/services/post/post.interfaces';
import { IUserProfileData } from 'src/app/shared/services/user/user.interfaces';

@Component({
    selector: 'app-profile-page',
    templateUrl: './profile-page.component.html',
    styleUrls: ['./profile-page.component.scss'],
})
export class ProfilePageComponent implements OnInit, OnDestroy {
    loading = true;
    posts: IPostCard[] = [];
    user: IUserProfileData;
    userSub: Subscription;

    constructor(
        private userService: UserService,
        private postService: PostService,
        private title: Title
    ) {}

    ngOnInit(): void {
        this.userSub = this.userService.userData$.pipe(
            skipWhile(user => !user),
            switchMap(user => {
                if (!this.user) {
                    this.user = user;
                    this.title.setTitle(`${user.username} | User Profile • Travellers`);
                    return this.postService.getMyPosts();
                } else {
                    this.user = user;
                    return EMPTY;
                }
            })
        ).subscribe(posts => {
            if (posts) {
                this.posts = posts
                this.loading = false
            }
        });
    }

    deletePost(id: number) {
        this.postService.deleteOne(id).subscribe(_ => {
            this.userService.userData$.next({
                ...this.user,
                posts: this.user.posts - 1,
            });
            this.posts = this.posts.filter((post) => post.post_id !== id);
        });
    }

    ngOnDestroy() {
        this.userSub.unsubscribe();
    }
}
