import { Component, inject, OnInit } from '@angular/core';
import { AdminStore } from '../admin.store';
import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Artist } from '../../../models/artist.model';
import { ArtistComponent } from './artist/artist.component';
import { Router } from '@angular/router';
import { ArtistInfoComponent } from './artist/artist-info/artist-info.component';
import { FirestoreService } from '../../../services/firestore.service';
import { FirebaseError } from '@angular/fire/app';
import { StorageService } from '../../../services/storage.service';
import { ConfirmDialogComponent } from '../shared/confirm-dialog/confirm-dialog.component';
import { InitArtistComponent } from './init-artist/init-artist.component';

import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
    selector: 'app-artist-2024',
    standalone: true,
    imports: [
        MatButtonModule,
        MatIconModule,
        MatProgressSpinnerModule
    ],
    templateUrl: './artists.component.html',
    styleUrl: './artists.component.scss'
})
export class ArtistsComponent {

    dialog = inject(MatDialog);
    router = inject(Router)
    fs = inject(FirestoreService);
    storage = inject(StorageService);
    adminStore = inject(AdminStore);


    onAddArtist() {
        const dialogRef = this.dialog.open(InitArtistComponent)
        dialogRef.afterClosed().subscribe((id) => {
            if (id) {
                this.router.navigate(['admin/artist', { id: id }])
            }
        })
    }
    onEdit(artist: Artist) {
        this.router.navigate(['admin/artist', {
            id: artist.id
        }])
    }
    onDelete(artistId: string) {
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            data: {
                message: `this will permanently delete the artist and all of it\'s properties`
            },
            maxWidth: '370px'
        })
        dialogRef.afterClosed().subscribe((res: boolean) => {
            if (res) {
                const path = `artists/${artistId}`
                this.checkForExistingFile(artistId)
                    .then((imageUrl: string) => {
                        console.log(`file found; ${imageUrl}`)
                    })
                    .catch((err: FirebaseError) => {
                        console.error(`failed to find file; ${err.message}`);
                    })
                    .then(() => {
                        return this.deleteFileFromStorage(path)
                    })
                    .catch((err: FirebaseError) => {
                        console.error(`failed to delete file ${err.message}`)
                    })
                    .then(() => {
                        return this.fs.deleteDoc(path)
                    })
                    .then((res: any) => {
                        console.log(`artist deleted; ${res}`)
                    })
                    .catch((err: FirebaseError) => {
                        console.error(`failed to delete artist; ${err.message}`)
                    })
            }
        })
        return;
    }

    private checkForExistingFile(artistId: string) {
        const path = `artists/${artistId}`
        return this.storage.checkForExistingFilename(path)

    }
    private deleteFileFromStorage(path) {
        return this.storage.deleteObject(path)
    }
}
