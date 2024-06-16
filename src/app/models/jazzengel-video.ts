import { ArtistForMedia } from "./artist-for-media";
import { Artist } from "./artist.model";

export type JazzengelVideo = {
    id?: string;
    downloadUrl: string;
    filename: string;
    title?: string;
    date?: Date;
    artists?: ArtistForMedia[];
    fileLocation?: string
}
