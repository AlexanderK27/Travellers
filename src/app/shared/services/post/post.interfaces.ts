export type imageSource = string | ArrayBuffer

export interface INewPostCard {
    author_avatar: imageSource;
    author_name: string;
    poster: imageSource;
    title: string;
}

export interface IPostCard extends INewPostCard {
    isSaved: boolean;
    post_created_at: Date;
    post_id: number;
    post_modified_at?: Date;
}

export interface IMyPostCard extends IPostCard {
    post_status: string;
}

export interface IPostFilters {
    amount_of_cities: number,
    amount_of_countries: number,
    amount_of_people: number,
    amount_of_days: number,
    budget: number,
    city: string[],
    continent: string[],
    country: string[],
}

export interface INewPost {
    author_avatar: imageSource;
    author_name: string;
    filters: IPostFilters;
    poster: imageSource;
    post_text: string;
    title: string;
}

export interface IPost extends INewPost {
    dislikes: number;
    likes: number;
    post_id: number;
    post_created_at: Date;

    comments?: number;
    post_modified_at?: Date;
}

export interface IPostAllowedChanges {
    post_modified_at: Date;
    poster: imageSource;
    post_text: string;
    title: string;
}
