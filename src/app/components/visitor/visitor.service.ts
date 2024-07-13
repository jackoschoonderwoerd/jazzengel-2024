import { inject, Injectable } from '@angular/core';
import { FirestoreService } from '../../services/firestore.service';
import { Artist } from '../../models/artist.model';
import { ArtistIdFeatured } from '../../models/artist-id-featured.model';

@Injectable({
    providedIn: 'root'
})
export class VisitorService {

    constructor() { }

    fs = inject(FirestoreService);
    artists: Artist[] = []

    getArtists() {
        const path = `artists`
        this.fs.asyncCollection(path)
            .then((artists: Artist[]) => {
                this.artists = artists
            })
    }

    getArtistById(artistId: string) {
        const promise = new Promise((resolve, reject) => {
            if (!this.artists.length) {
                const path = `artists`
                return this.fs.asyncCollection(path)
                    .then((artists: Artist[]) => {
                        const artistsArray = artists.filter((artist: Artist) => {
                            return artist.id === artistId
                        })
                        resolve(artistsArray[0])
                    })
            } else {
                const artistsArray = this.artists.filter((artist: Artist) => {
                    return artist.id === artistId
                })
                resolve(artistsArray[0])
            }
        })
        return promise
    }

}
