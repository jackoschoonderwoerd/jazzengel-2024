import { patchState, signalStore, withComputed, withMethods, withState } from "@ngrx/signals";

import { inject } from "@angular/core";
import { FirestoreService } from "./../../services/firestore.service";




type VisitorState = {
    selectedLanguage: string

}

const initialState: VisitorState = {

    selectedLanguage: 'dutch'

}

export const VisitorStore = signalStore(
    { providedIn: 'root' },
    withState(initialState),

    withMethods(
        (store, fs = inject(FirestoreService)) => ({
            setLanguage(language: string) {
                patchState(store, { selectedLanguage: language })
            }


        })
    ),
);


