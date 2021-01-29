export type imageSource = string | ArrayBuffer

export interface IUserCredentials {
    email: string;
    password: string;
}

export interface IUserBasicProfileData {
    avatar: imageSource;
    bio: string;
    contact: string;
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
}

export interface IAuthorProfileData extends IUserBasicProfileData {
    followers: number;
    followings: number;
    iFollow: boolean;
    posts: number;
    username: string;
}
