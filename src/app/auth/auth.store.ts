

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
import { AdminStore } from '../components/admin/admin.store';
import { CalendarService } from '../services/calendar.service';
import { User as FirebaseUser } from '@angular/fire/auth';

const AUTH_DATA = 'auth_data'

type AuthState = {
    isLoggedIn: boolean;
    dateRangeStart: Date;
    dateRangeEnd: Date;
}
const initialState: AuthState = {
    isLoggedIn: false,
    dateRangeStart: new Date(new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()).setHours(0, 0, 0, 0)),
    dateRangeEnd: new Date(new Date(new Date().getFullYear(), new Date().getMonth() + 3, new Date().getDate()).setHours(0, 0, 0, 0))
}

export const AuthStore = signalStore(
    { providedIn: 'root' },
    withState(initialState),
    withMethods(
        (store, auth = inject(Auth), adminStore = inject(AdminStore), calendarService = inject(CalendarService)) => ({
            async login(userLogin: UserLogin) {

                signInWithEmailAndPassword(auth, userLogin.email, userLogin.password)
                    .then((userCredential: UserCredential) => {
                        console.log(userCredential.user.email)
                        patchState(store, { isLoggedIn: true });
                    })
                    .catch((err: AuthError) => {
                        console.log(err.message)
                        patchState(store, { isLoggedIn: false })
                    })
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
            persistLogin(user: FirebaseUser) {
                console.log('persistLogin()')
                patchState(store, { isLoggedIn: true })
                // adminStore.setVisibleWeeksAhead(50);
            }
        })
    ),
)

