import { imageSource } from './components/img-picker/image-picker.service';

export interface IServerResponse {
    error?: string;
    message?: string;
    payload?: unknown;
}

export interface Comment {
    created: Date;
    username: string;
    text: string;

    answers?: Comment[];
    userAv?: imageSource;
    id?: string;
}

export interface MiniatureAvatar {
    username: string;
    avatar: imageSource;
}

export interface SelectOption {
    value: string;
    title: string;
}
