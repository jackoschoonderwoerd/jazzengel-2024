import { Component, inject, Input } from '@angular/core';
import { Artist } from '../../../../models/artist.model';
import { MatExpansionModule } from '@angular/material/expansion';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { MatTabsModule } from '@angular/material/tabs';
import { AdminStore } from '../../../admin/admin.store';
import { FirestoreService } from '../../../../services/firestore.service';

@Component({
    selector: 'app-artist-bio',
    imports: [
        MatExpansionModule,

        MatCardModule,
        MatButtonModule,
        MatTabsModule,
        MatIconModule,

    ],
    templateUrl: './artist-bio.component.html',
    styleUrl: './artist-bio.component.scss'
})
export class ArtistBioComponent {
    @Input() public artist!: Artist;
    isExpanded: boolean = false;
    adminStore = inject(AdminStore);
    fs = inject(FirestoreService);
    biography: string;
    imageUrl: string;

    onClose() {
        this.isExpanded = false
    }
    onArtistSelected(event) {
        this.adminStore.setSelectedArtistId(this.artist.id)
    }
    selectedArtistId(artistId: string) {
        // alert(artistId)
        const pathToArtist = `artists/${artistId}`
        this.fs.getDoc(pathToArtist).subscribe((artist: Artist) => {
            this.biography = artist.biography;
            this.imageUrl = artist.imageUrl
        })
        console.log(artistId)
    }
}
