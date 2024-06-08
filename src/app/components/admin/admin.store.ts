import { patchState, signalStore, withComputed, withMethods, withState } from "@ngrx/signals";

import { inject } from "@angular/core";
import { FirestoreService } from "./../../services/firestore.service";


import { map, take } from "rxjs";
import { setPersistence } from "@angular/fire/auth";
import { Booking } from "../../models/booking.model";
import { Appearance } from '../../models/appearance';
import { Artist } from "../../models/artist.model";
import { Concert } from "../../models/concert.model";

import { ArtistBooked } from "../../models/artist-booked.model";




type AdminState = {
    artists: Artist[]
    // artists2024: Artist2024[]
    concerts: Concert[];
    sortedConcerts: any;
    isLoading: boolean;
    concertThisSunday: any;
    selectedDateNumber: number;
    selectedArtistId: string;
    visibleWeeksAhead: number
}

const initialState: AdminState = {

    artists: [],
    // artists2024: [],
    concerts: [],
    sortedConcerts: [],
    isLoading: false,
    concertThisSunday: null,
    selectedDateNumber: null,
    selectedArtistId: null,
    visibleWeeksAhead: 12
}






export const AdminStore = signalStore(
    { providedIn: 'root' },
    withState(initialState),

    withMethods(
        (store, fs = inject(FirestoreService)) => ({
            async loadArtists() {
                patchState(store, { isLoading: true })
                const path = `artists`;
                await fs.collection(path).subscribe((artists: Artist[]) => {

                    console.log(artists)
                    artists.sort((a: Artist, b: Artist) => a.name.localeCompare(b.name));
                    patchState(store, { artists, isLoading: false })
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
            },
            // async loadArtists2024() {
            //     patchState(store, { isLoading: true })
            //     const path = `artists-2024`
            //     await fs.collection(path)
            //         .subscribe((artists2024: Artist2024[]) => {
            //             patchState(store, { isLoading: false })
            //             patchState(store, { artists2024 })
            //         })
            // },
            setConcertThisSunday(concert: Concert) {
                console.log(concert)
                const artists: Artist[] = []
                concert.artistsBooked.forEach((artistBooked: ArtistBooked) => {
                    const path = `artists/${artistBooked.artistId}`
                    fs.getDoc(path).pipe(take(1)).subscribe((artist: Artist) => {
                        artists.push(artist)
                    })
                    const concertThisSunday = {
                        artists: artists,
                        date: concert.date
                    }
                    patchState(store, { concertThisSunday })
                })

                // patchState(store, { concertThisSunday: concert })
            },
            setSelectedDateNumber(selectedDateNumber: number) {
                patchState(store, { selectedDateNumber: selectedDateNumber })
            },
            setSelectedArtistId(id: string) {
                patchState(store, { selectedArtistId: id })
            },
            setVisibleWeeksAhead(visibleWeeksAhead: number) {
                console.log(visibleWeeksAhead);
                patchState(store, { visibleWeeksAhead: visibleWeeksAhead })
            }
        })
    ),
);

