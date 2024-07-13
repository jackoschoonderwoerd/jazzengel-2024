import { DatePipe, JsonPipe, NgStyle } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { AdminStore } from '../../../admin/admin.store';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Artist } from '../../../../models/artist.model';

import { MatCheckboxModule } from '@angular/material/checkbox';
import { ArtistIdFeatured } from '../../../../models/artist-id-featured.model';
import { Concert } from '../../../../models/concert.model';
import { FirestoreService } from '../../../../services/firestore.service';
import { DocumentReference } from '@angular/fire/firestore';
import { FirebaseError } from '@angular/fire/app';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ConfirmDialogComponent } from '../../../admin/shared/confirm-dialog/confirm-dialog.component';
import { take } from 'rxjs';
import { VisitorService } from '../../../visitor/visitor.service';

@Component({
    selector: 'app-add-concert',
    standalone: true,
    imports: [
        DatePipe,
        MatDialogModule,
        MatSelectModule,
        JsonPipe,
        ReactiveFormsModule,
        MatCheckboxModule,
        MatButtonModule,
        MatIconModule,
        NgStyle
    ],
    templateUrl: './add-concert.component.html',
    styleUrl: './add-concert.component.scss'
})
export class AddConcertComponent implements OnInit {
    data = inject(MAT_DIALOG_DATA)
    fb = inject(FormBuilder)
    adminStore = inject(AdminStore)
    form!: FormGroup
    artists: Artist[] = [];
    artistsIdFeatured: ArtistIdFeatured[] = [];
    editmode: boolean = false;
    concert!: Concert;
    concertChanged: boolean = false;
    dialog = inject(MatDialog);
    visitorService = inject(VisitorService)


    constructor(public dialogRef: MatDialogRef<AddConcertComponent>) { }

    fs = inject(FirestoreService)

    ngOnInit(): void {
        if (this.data.concert.id) {
            console.log(this.data.concert.id)
            this.editmode = true;
        } else {
            console.log('no id')
            this.editmode = false;
        }
        if (this.data.concert) {
            this.concert = this.data.concert;
            console.log(this.concert)
            if (this.concert.artistsIdFeatured.length) {
                this.artistsIdFeatured = this.concert.artistsIdFeatured;
                // this.editmode = true;
                this.artistsIdFeatured.forEach((artistBooked: ArtistIdFeatured) => {
                    this.visitorService.getArtistById(artistBooked.artistId)
                        .then((artist: Artist) => {
                            this.artists.push(artist)
                        })
                    // const path = `artists/${artistBooked.artistId}`
                    // this.fs.getDoc(path).pipe(take(1)).subscribe((artist: Artist) => {
                    // })
                })
            }
        }
        this.initForm()
        // this.adminStore.loadArtists();
    }

    getIsFeatured(artistId: string) {
        const artistIdFeatured = this.artistsIdFeatured.find((artistIdFeatured: ArtistIdFeatured) => {
            return artistIdFeatured.artistId === artistId
        })
        return artistIdFeatured?.isFeatured
    }

    initForm() {
        this.form = this.fb.group({
            artist: new FormControl()
        })
    }
    artistSelected() {
        this.concertChanged = true;
        const artist = this.form.value.artist
        this.artists.push(this.form.value.artist)
        const ArtistIdFeatured: ArtistIdFeatured = {
            artistId: artist.id,
            isFeatured: false
        }
        this.artistsIdFeatured.push(ArtistIdFeatured)
        this.form.reset();

    }
    onCheckboxChange(event: any, index: number) {
        this.concertChanged = true;
        this.artistsIdFeatured[index].isFeatured = event.checked;
        console.log(this.artistsIdFeatured)
    }

    onDelete(index: number) {
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            data: {
                message: 'This will remove the selected artist from the date'
            }
        })
        dialogRef.afterClosed().subscribe((res: boolean) => {
            if (res) {

                this.artists.splice(index, 1)
                this.concertChanged = true;
                this.artistsIdFeatured.splice(index, 1)
            }
        })
    }

    addOrUpdateConcert() {
        const concert: Concert = {
            date: this.concert.date,
            timestamp: new Date(this.concert.date).setHours(0, 0, 0, 0),
            artistsIdFeatured: this.artistsIdFeatured
        }
        console.log(concert)
        if (!this.editmode) {
            const path = `concerts-2024`
            this.fs.addDoc(path, concert)
                .then((docRef: DocumentReference) => {
                    console.log(`concert booked; ${docRef.id}`)
                    this.dialogRef.close();
                })
                .catch((err: FirebaseError) => {
                    console.error(err.message)
                })

        } else {
            const path = `concerts-2024/${this.concert.id}`
            console.log(path);
            this.fs.updateDoc(path, { artistsIdFeatured: this.artistsIdFeatured })
                .then((res: any) => {
                    console.log(`document updated`);
                    this.dialogRef.close();
                })
                .catch((err: FirebaseError) => {
                    console.log(`failed to update document; ${err.message}`)
                })
        }

    }

    onMove(direction: string, index: number) {
        this.concertChanged = true;
        if (direction === 'up') {
            const index1 = index;
            const index2 = index - 1;
            // Check if the indices are within the array bounds
            if (index1 >= 0 && index1 < this.artistsIdFeatured.length && index2 >= 0 && index2 < this.artistsIdFeatured.length) {
                // Swap using destructuring
                [this.artistsIdFeatured[index1], this.artistsIdFeatured[index2]] = [this.artistsIdFeatured[index2], this.artistsIdFeatured[index1]]
            }
            if (index1 >= 0 && index1 < this.artists.length && index2 >= 0 && index2 < this.artists.length) {
                // Swap using destructuring
                [this.artists[index1], this.artists[index2]] = [this.artists[index2], this.artists[index1]]
            }

        } else if (direction === 'down') {
            const index1 = index;
            const index2 = index + 1;
            if (index1 >= 0 && index1 < this.artistsIdFeatured.length && index2 >= 0 && index2 < this.artistsIdFeatured.length) {
                // Swap using destructuring
                [this.artistsIdFeatured[index1], this.artistsIdFeatured[index2]] = [this.artistsIdFeatured[index2], this.artistsIdFeatured[index1]]
            }
            if (index1 >= 0 && index1 < this.artists.length && index2 >= 0 && index2 < this.artists.length) {
                // Swap using destructuring
                [this.artists[index1], this.artists[index2]] = [this.artists[index2], this.artists[index1]]
            }
        }
    }
}
