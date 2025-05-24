import { patchState, signalStore, withComputed, withMethods, withState } from "@ngrx/signals";

import { inject } from "@angular/core";

import { take } from "rxjs";
import { FirebaseError } from "@angular/fire/app";

import { SnackbarService } from "../snackbar.service";
import { FirestoreService } from "../../../../services/firestore.service";
import { AuthStore } from "../../../../auth/auth.store";
import { Visit } from "../../../../models/visit.model";

type VisitsState = {
    visitsArray: any[];
    documentId: string;
}

const initialState: VisitsState = {
    visitsArray: [],
    documentId: ''
}

export const VisitsStore = signalStore(
    { providedIn: 'root', protectedState: false },
    withState(initialState),

    withMethods(
        (store, fs = inject(FirestoreService), authStore = inject(AuthStore), sb = inject(SnackbarService)) => ({
            loadAllVisits() {
                const path = `visits`;
                fs.collection(path).pipe(take(1)).subscribe((visitsCollection: any[]) => {
                    console.log(visitsCollection)
                    if (!visitsCollection || visitsCollection.length === 0) {
                        this.initializeFirstVisit()

                    } else {
                        patchState(store, { documentId: visitsCollection[0].id })
                        const visitsArray: Visit[] = visitsCollection[0].visitsArray
                        console.log(visitsArray)
                        visitsArray.sort((a, b) => b.date.seconds - a.date.seconds);
                        patchState(store, { visitsArray })
                        this.addVisitToVisitsArray()

                    }
                })
            },
            initializeFirstVisit() {
                const visit: any = { date: new Date() }
                const visitsArray: Visit[] = [visit]
                fs.addDoc(`visits`, { visitsArray })
                    .then((res: any) => {
                        console.log(res)
                        patchState(store, { visitsArray })
                    })
                    .catch((err: FirebaseError) => console.log(err))
            },
            addVisitToVisitsArray() {
                if (!authStore.isLoggedIn()) {
                    const visit: any = { date: new Date() }
                    fs.addElementToArray(`visits/${store.documentId()}`, 'visitsArray', visit)
                        .then((res: any) => console.log(res))
                        .catch((err: FirebaseError) => console.log(err));
                } else {
                    sb.openSnackbar(`since you are logged in, this visit is not added to visits`)
                }

            },
            deleteVisit(doomedVisit) {
                const path = `visits/${store.documentId()}`
                // 1 remove from db/array
                fs.removeElementFromArray(path, 'visitsArray', doomedVisit)
                    .then((res: any) => {
                        console.log('element removed from db array')
                    }
                    )
                    .catch((err: FirebaseError) => {
                        console.log(err)
                    })
                    // 2 remove locally
                    .then(() => {
                        const visitsArray = store.visitsArray();
                        const newvisitsArray = visitsArray.filter((visit) => {
                            return visit !== doomedVisit
                        })

                        patchState(store, { visitsArray: newvisitsArray })
                    })
                    .catch((err: any) => { console.log('failed to remove the element locally', err) })
                    .finally(() => console.log('operation finalized'))
            }
        })
    ),
);
