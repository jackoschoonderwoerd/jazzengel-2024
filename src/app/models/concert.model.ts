import { ArtistBooked } from "./artist-booked.model";

export interface Concert {
    id?: string;
    date: Date;
    artistsBooked: ArtistBooked[];
}
