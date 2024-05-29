import { Artist } from "./artist.model";

export interface Booking {
    artist: Artist,
    date: number[];
    isFeatured: boolean;
}
