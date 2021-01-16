import { Component, Input } from '@angular/core';
import { INewPostCard } from 'src/app/shared/services/post/post.interfaces';

@Component({
    selector: 'app-new-post-card',
    templateUrl: './new-post-card.component.html',
    styleUrls: [
        './new-post-card.component.scss',
        '../../../../shared/styles/post-card.scss'
    ],
})
export class NewPostCardComponent {
    @Input() post: INewPostCard;

    createdAt = new Date();
    croppedImageSize = [{ width: 480, height: 360 }];
    croppedImageRatio = 4 / 3;

    constructor() {}
}
