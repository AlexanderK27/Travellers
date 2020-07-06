import { ImageSource } from './types'

export interface FirebaseAuthResponse {
    idToken: string
    expiresIn: string
    localId: string
}

export interface PlanCard {
    author: string
    authorId: string
    poster: ImageSource
    title: string
    link?: string
    likes?: number
    dislikes?: number
    comments?: number
    saved?: boolean
}

export interface ProfileData {
    name: string
    website: string
    bio: string
    avatar: ImageSource
}

export interface Publication {
    published: boolean
    created: Date
    modified?: Date
    authorId: string
    author: string
    poster: ImageSource
    title: string
    text: string
    link?: string
    likes?: number
    dislikes?: number
    comments?: number
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
    name?: string
    website?: string
    bio?: string
    avatar?: ImageSource
}
