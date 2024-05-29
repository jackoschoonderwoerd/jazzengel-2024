import { patchState, signalStore, withComputed, withMethods, withState } from "@ngrx/signals";

import { inject } from "@angular/core";
import { FirestoreService } from "./../../services/firestore.service";


import { map, take } from "rxjs";
import { setPersistence } from "@angular/fire/auth";
import { Booking } from "../../models/booking.model";
import { Appearance } from '../../models/appearance';
import { Artist } from "../../models/artist.model";
import { Concert } from "../../models/concert.model";




type AdminState = {
    artists: Artist[]
    concerts: Concert[];
    sortedConcerts: any
}

const initialState: AdminState = {

    artists: [],
    concerts: [],
    sortedConcerts: []
}






export const AdminStore = signalStore(
    { providedIn: 'root' },
    withState(initialState),

    withMethods(
        (store, fs = inject(FirestoreService)) => ({
            async loadArtists() {
                const path = `artists`;
                await fs.collection(path).subscribe((artists: Artist[]) => {
                    console.log(artists)
                    artists.sort((a: Artist, b: Artist) => a.name.localeCompare(b.name));
                    console.log(artists)
                    patchState(store, { artists })
                });
            },
            async loadConcerts() {
                const path = `concerts`;
                await fs.collection(path).subscribe((rawConcerts: any[]) => {
                    // console.log(rawConcerts)
                    const concerts: Concert[] = []
                    rawConcerts.forEach((rawConcert: any) => {
                        const concert: Concert = {
                            id: rawConcert.id,
                            artistsBooked: rawConcert.artistsBooked,
                            date: new Date(rawConcert.date.seconds * 1000)
                        }
                        concerts.push(concert)

                    })
                    // console.log(concerts)
                    patchState(store, { concerts })
                })
            },
            async loadSortedConcerts(sortedConcerts: any) {
                // console.log(sortedConcerts)
                patchState(store, { sortedConcerts })
            }
        })
    ),
);

