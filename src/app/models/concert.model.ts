import { ArtistIdFeatured } from "./artist-id-featured.model";

export interface Concert {
    id?: string;
    date?: Date;
    timestamp?: number;
    artistsIdFeatured: ArtistIdFeatured[];
}
