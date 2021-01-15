export type imageSource = string | ArrayBuffer

export interface IUserCredentials {
    email: string;
    password: string;
    username?: string;
}

export interface IUserBasicProfileData {
    avatar: imageSource;
    bio: string;
    contact: string;
    minAvatar: imageSource;
    real_name: string;
}

export interface IUserProfileData extends IUserBasicProfileData {
    disliked_posts: number[];
    followers: number;
    followings: number;
    liked_posts: number[];
    posts: number;
    saved_posts: number[];
    username: string;
    // userId?: string
    // subscriptions?: string[]
    // liked?: any[],
    // disliked?: any[],
    // saved?: any[]
}
