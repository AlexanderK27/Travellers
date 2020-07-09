import { ImageSource } from './types'

export interface Confirmation {
    callback: Function
    confirmButtonTitle: string
    text: string
}

export interface FirebaseAuthResponse {
    expiresIn: string
    idToken: string
    localId: string
}

export interface PlanCard {
    author: string
    authorId: string
    poster: ImageSource
    title: string

    comments?: number
    dislikes?: number
    link?: string
    likes?: number
    published?: boolean
    saved?: boolean
}

export interface ProfileData {
    avatar: ImageSource
    bio: string
    name: string
    website: string
}

export interface PubAllowedChanges {
    modified: Date
    poster: ImageSource
    text: string
    title: string
}

export interface Publication {
    author: string
    authorId: string
    created: Date
    poster: ImageSource
    published: boolean
    text: string
    title: string

    comments?: number
    dislikes?: number
    likes?: number
    link?: string
    modified?: Date
    saved?: boolean
}

export interface UserCredentials {
    email: string
    password: string
    returnSecureToken?: boolean
}

export interface UserData {
    userId: string
    username: string

    avatar?: ImageSource
    bio?: string
    disliked?: Array<string>
    liked?: Array<string>
    name?: string
    publications?: number
    saved?: Array<string>
    subscribers?: number
    subscriptions?: Array<string>
    website?: string
}
