import { DatePipe, JsonPipe, NgStyle } from '@angular/common';
import { Component, EventEmitter, inject, OnInit } from '@angular/core';
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

import { CalendarService } from '../../../../services/calendar.service';
import { WarnDialogComponent } from '../../../admin/shared/warn-dialog/warn-dialog.component';

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
    visitorService = inject(VisitorService);
    calendarService = inject(CalendarService);



    constructor(public dialogRef: MatDialogRef<AddConcertComponent>) { }

    fs = inject(FirestoreService)

    ngOnInit(): void {
        if (this.data.concert) {
            console.log(this.data.concert)
            this.concert = this.data.concert;
            if (this.concert.id) {
                this.editmode = true;
            }
            // console.log(this.concert)
            if (this.concert.artistsIdFeatured.length) {
                this.artistsIdFeatured = this.concert.artistsIdFeatured;
                this.artistsIdFeatured.forEach((artistBooked: ArtistIdFeatured) => {
                    this.visitorService.getArtistById(artistBooked.artistId)
                        .then((artist: Artist) => {
                            this.artists.push(artist)
                        })
                })
            }
        } else {
            this.dialog.open(WarnDialogComponent, {
                data: {
                    message: 'no concert available for selected date'
                }
            })
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
        this.artists.unshift(this.form.value.artist)
        const ArtistIdFeatured: ArtistIdFeatured = {
            artistId: artist.id,
            isFeatured: false
        }
        this.artistsIdFeatured.unshift(ArtistIdFeatured)
        this.form.reset();

    }
    onCheckboxChange(event: any, index: number) {
        this.concertChanged = true;
        this.artistsIdFeatured[index].isFeatured = event.checked;
    }

    onDeleteArtist(index: number) {
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
        if (this.concert.id) {
            const updatedConcert: Concert = {
                id: this.concert.id,
                date: this.concert.date,
                timestamp: new Date(this.concert.date).setHours(0, 0, 0, 0),
                artistsIdFeatured: this.artistsIdFeatured
            }
            this.dialogRef.close(updatedConcert);

            // this.updateConcert(updatedConcert)
            //     .then((res: any) => {
            //         console.log(res);
            //         // this.calendarService.getCalendar(0, 3);

            //     })
            //     .catch((err: FirebaseError) => {
            //         console.error(err.message)
            //     })
        } else {
            const newConcert: Concert = {
                date: this.concert.date,
                timestamp: new Date(this.concert.date).setHours(0, 0, 0, 0),
                artistsIdFeatured: this.artistsIdFeatured
            }
            this.dialogRef.close(newConcert)
            // this.addConcert(newConcert)
            //     .then((docRef: DocumentReference) => {
            //         console.log(docRef.id);
            //     })
            //     .catch((err: FirebaseError) => {
            //         console.error(err.message)
            //     })
        }
        this.form.reset()
        // this.concert = null;
        this.artists = [];
        this.artistsIdFeatured = [];
    }
    onDeleteConcert() {
        this.dialogRef.close()
        console.log(this.concert.id)
        const path = `concerts-2024/${this.concert.id}`
        this.fs.deleteDoc(path)
            .then((res: any) => {
                console.log(res);
                this.dialogRef.close();
            })
            .catch((err: FirebaseError) => {
                console.log(err.message)
            })
    }

    updateConcert(updatedConcert: Concert) {
        const path = `concerts-2024/${updatedConcert.id}`
        return this.fs.updateDoc(path, updatedConcert)
    }
    addConcert(newConcert: Concert) {
        const path = `concerts-2024`
        return this.fs.addDoc(path, newConcert)
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
