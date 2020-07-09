import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ImageSource } from '../types'

@Injectable({providedIn: 'root'})
export class AvatarService {
    avatar$: BehaviorSubject<ImageSource> = new BehaviorSubject<ImageSource>('')
    croppedAvatar$: BehaviorSubject<ImageSource> = new BehaviorSubject<ImageSource>('')
    minCroppedAvatar$: BehaviorSubject<ImageSource> = new BehaviorSubject<ImageSource>('')

    constructor() {}
}
