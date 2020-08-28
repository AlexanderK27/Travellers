import { ImageSource } from './types';

export interface Comment {
    created: Date;
    username: string;
    text: string;

    answers?: Comment[];
    userAv?: ImageSource;
    id?: string;
}

export interface Confirmation {
    callback: Function;
    confirmButtonTitle: string;
    text: string;
}

export interface Filters {
    amountCountries: string;
    amountCities: string;
    budget: string;
    city: string;
    continent: string;
    country: string;
    duration: string;
    people: string;
}

export interface FirebaseAuthResponse {
    expiresIn: string;
    idToken: string;
    localId: string;
}

export interface MiniatureAvatar {
    username: string;
    avatar: ImageSource;
}

export interface PlanCard {
    author: string;
    authorId: string;
    authorAv: ImageSource;
    poster: ImageSource;
    title: string;

    comments?: number;
    created?: Date;
    dislikes?: number;
    link?: string;
    likes?: number;
    published?: boolean;
    saved?: boolean;
}

export interface ProfileData {
    avatar: ImageSource;
    bio: string;
    name: string;
    website: string;
}

export interface PubAllowedChanges {
    modified: Date;
    poster: ImageSource;
    text: string;
    title: string;
}

export interface Publication {
    author: string;
    authorId: string;
    authorAv: ImageSource;
    created: Date;
    filters: Filters;
    poster: ImageSource;
    published: boolean;
    text: string;
    title: string;

    comments?: number;
    dislikes?: number;
    likes?: number;
    link?: string;
    modified?: Date;
    saved?: boolean;
}

export interface SelectOption {
    value: string;
    title: string;
}

export interface UserCredentials {
    email: string;
    password: string;
    returnSecureToken?: boolean;
}

export interface UserData {
    userId: string;
    username: string;

    avatar?: ImageSource;
    bio?: string;
    disliked?: Array<string>;
    liked?: Array<string>;
    minAvatar?: ImageSource;
    name?: string;
    publications?: number;
    saved?: Array<string>;
    subscribers?: number;
    subscriptions?: Array<string>;
    website?: string;
}
