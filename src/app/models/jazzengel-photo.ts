import { ArtistForMedia } from "./artist-for-media";
import { Artist } from "./artist.model";

export type JazzengelPhoto = {
    id?: string;
    downloadUrl: string;

    date?: Date;
    artists?: ArtistForMedia[];
    fileLocation: string
}
