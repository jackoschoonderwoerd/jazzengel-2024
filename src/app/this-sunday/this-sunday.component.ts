import { Component, inject, OnInit } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CalendarService } from '../services/calendar.service';
import { AdminStore } from '../components/admin/admin.store';
import { DatePipe, JsonPipe } from '@angular/common';
import { Concert } from '../models/concert.model';
import { Artist } from '../models/artist.model';
import { ArtistIdFeatured } from '../models/artist-id-featured.model';
import { FirestoreService } from '../services/firestore.service';
import { MatIconModule } from '@angular/material/icon';
import { CapitalizeNamePipe } from '../pipes/capitalize-name.pipe';
import { VisitorService } from '../components/visitor/visitor.service';

@Component({
    selector: 'app-this-sunday',
    imports: [JsonPipe, DatePipe, MatIconModule, MatDialogModule, CapitalizeNamePipe],
    templateUrl: './this-sunday.component.html',
    styleUrl: './this-sunday.component.scss'
})
export class ThisSundayComponent implements OnInit {

    adminStore = inject(AdminStore)
    artists: Artist[] = [];
    fs = inject(FirestoreService);
    visitorService = inject(VisitorService);
    calenderService = inject(CalendarService)
    concert: Concert;
    closestSunday: Date




    constructor(
        private dialogRef: MatDialogRef<ThisSundayComponent>
    ) { }

    ngOnInit(): void {
        // this.getConcertClosestSunday().then((concerts: Concert[]) => {
        //     this.concert = concerts[0]
        //     this.concert.artistsIdFeatured.forEach((artistIdFeatured: ArtistIdFeatured) => {
        //         this.visitorService.getArtistById(artistIdFeatured.artistId).then((artist: Artist) => {
        //             this.artists.push(artist)
        //         })
        //     })
        // })
    }
    getConcertClosestSunday() {
        const closestSunday: Date = this.getClosestSunday()
        // console.log(closestSunday);
        // this.getConcertByDate(closestSunday);
        return this.getConcertsByDateRange(closestSunday, closestSunday)

    }
    private getClosestSunday() {
        const today = new Date();
        const dayOfWeek = today.getDay(); // getDay() returns a number between 0 (Sunday) and 6 (Saturday)
        const daysUntilNextSunday = (7 - dayOfWeek) % 7; // Calculate days until next Sunday

        // If today is Sunday, we want the next Sunday which is 7 days away
        const nextSunday = new Date(today);
        if (today.getDay() === 0) {
            console.log('returning today')
            this.closestSunday = today
            return today
        } else {
            nextSunday.setDate(today.getDate() + (daysUntilNextSunday === 0 ? 7 : daysUntilNextSunday));
            // console.log('returning next Sunday')
            this.closestSunday = nextSunday
            return nextSunday;
        }
    }

    getConcertsByDateRange(startDate: Date, endDate: Date) {
        // const promise = new Promise((resolve, reject) => {
        //     this.fs.asyncCollectionByDateRange(
        //         `concerts`,
        //         'date',
        //         startDate,
        //         endDate

        //     ).then((rawConcertsArray: any[]) => {
        //         // console.log(rawConcertsArray)
        //         const concerts: Concert[] = rawConcertsArray.map(rawConcert => {
        //             return {
        //                 ...rawConcert,
        //                 date: new Date(rawConcert.date.seconds * 1000)
        //             }
        //         })
        //         // console.log(concerts)
        //         resolve(concerts)
        //     })
        // })
        // return promise
    }

    onClose() {
        this.dialogRef.close()
    }
}
