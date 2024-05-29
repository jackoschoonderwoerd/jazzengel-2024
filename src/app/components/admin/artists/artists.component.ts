import { Component, inject, OnInit } from '@angular/core';
import { AdminStore } from '../admin.store';
import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Artist } from '../../../models/artist.model';
import { AddArtistComponent } from './add-artist/add-artist.component';

@Component({
    selector: 'app-artist-2024',
    standalone: true,
    imports: [
        MatButtonModule,
        MatIconModule
    ],
    templateUrl: './artists.component.html',
    styleUrl: './artists.component.scss'
})
export class ArtistsComponent implements OnInit {
    adminStore = inject(AdminStore);
    dialog = inject(MatDialog)

    ngOnInit(): void {
        this.adminStore.loadArtists();
    }
    onAddArtist() {
        const dialogRef = this.dialog.open(AddArtistComponent)
        dialogRef.afterClosed().subscribe((artist: Artist) => {
            console.log(artist)
        })
    }
    onEdit(artist: Artist) {

    }
    onDelete(artistId: string) {

    }
}
