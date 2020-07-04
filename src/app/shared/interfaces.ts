import { ImageSource } from './types'

export interface FirebaseAuthResponse {
    idToken: string
    expiresIn: string
}

export interface ProfileData {
    name: string
    website: string
    bio: string
    avatar: ImageSource
}

export interface UserCredentials {
    email: string
    password: string
    returnSecureToken?: boolean
}

export interface UserData {
    userId: string
    username: string
    profileData?: ProfileData
}
