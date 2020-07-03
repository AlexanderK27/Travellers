import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

type ImageSource = string | ArrayBuffer

@Injectable({providedIn: 'root'})
export class AvatarService {
    avatar$: BehaviorSubject<ImageSource> = new BehaviorSubject<ImageSource>('')
    croppedAvatar$: BehaviorSubject<ImageSource> = new BehaviorSubject<ImageSource>('')

    constructor() {}
}
