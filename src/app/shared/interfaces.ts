import { ImageSource } from './types'

export interface PubAllowedChanges {
    modified: Date
    poster: ImageSource
    text: string
    title: string
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
    saved?: boolean
}

export interface ProfileData {
    avatar: ImageSource
    bio: string
    name: string
    website: string
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
    name?: string
    website?: string
}
