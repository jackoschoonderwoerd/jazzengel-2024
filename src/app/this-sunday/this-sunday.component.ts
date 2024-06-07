import { Component, inject, OnInit } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CalendarService } from '../services/calendar.service';
import { AdminStore } from '../components/admin/admin.store';
import { DatePipe, JsonPipe } from '@angular/common';
import { Concert } from '../models/concert.model';
import { Artist } from '../models/artist.model';
import { ArtistBooked } from '../models/artist-booked.model';
import { FirestoreService } from '../services/firestore.service';
import { MatIconModule } from '@angular/material/icon';
import { CapitalizeNamePipe } from '../pipes/capitalize-name.pipe';

@Component({
    selector: 'app-this-sunday',
    standalone: true,
    imports: [JsonPipe, DatePipe, MatIconModule, MatDialogModule, CapitalizeNamePipe],
    templateUrl: './this-sunday.component.html',
    styleUrl: './this-sunday.component.scss'
})
export class ThisSundayComponent implements OnInit {

    adminStore = inject(AdminStore)
    artists: Artist[] = [];
    fs = inject(FirestoreService)

    constructor(
        private dialogRef: MatDialogRef<ThisSundayComponent>
    ) { }

    ngOnInit(): void {
        // const concertThisSunday: Concert = this.adminStore.concertThisSunday();
        setTimeout(() => {

            // concertThisSunday.artistsBooked.forEach((artistBooked: ArtistBooked) => {
            //     console.log(artistBooked)
            //     const path = `artists/${artistBooked.artistId}`
            //     this.fs.getDoc(path).subscribe((artist: Artist) => {
            //         console.log(artist)
            //         this.artists.push(artist)
            //     })
            // })
        },);
    }

    onClose() {
        console.log('close')
        this.dialogRef.close()
    }
}
