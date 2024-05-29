

import {
    getAuth,
    Auth,
    AuthError,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    user,
    UserCredential,
    setPersistence,
    browserLocalPersistence,
    browserSessionPersistence
} from '@angular/fire/auth';


import { signalStore, patchState, withComputed, withMethods, withState } from "@ngrx/signals";

import { inject } from "@angular/core";
import { FirebaseApp, FirebaseError } from '@angular/fire/app';
import { UserLogin } from '../models/user-login.model';



type AuthState = {
    isLoggedIn: boolean;
}
const initialState: AuthState = {
    isLoggedIn: false
}
export const AuthStore = signalStore(
    { providedIn: 'root' },
    withState(initialState),
    withMethods(
        (store, auth = inject(Auth)) => ({
            async login(userLogin: UserLogin) {
                // auth.setPersistence(browserLocalPersistence).then(() => {
                signInWithEmailAndPassword(auth, userLogin.email, userLogin.password)
                    .then((userCredential: UserCredential) => {
                        console.log(userCredential)
                        patchState(store, { isLoggedIn: true })

                    })
                    .catch((err: AuthError) => {
                        console.log(err.message)
                        patchState(store, { isLoggedIn: false })
                    })
                // })
            },
            async logout() {
                console.log('loggin out')
                auth.signOut().then((res: any) => {
                    console.log('you are succesfully logged out')
                    patchState(store, { isLoggedIn: false })
                })
                    .catch((err: FirebaseError) => {
                        console.error('failed to log out')
                    })
                patchState(store, { isLoggedIn: false })
            },
            persistLogin() {
                patchState(store, { isLoggedIn: true })
            }
        })
    ),
)
