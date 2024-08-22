import { Component, inject, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { Concert } from '../../../models/concert.model';
import { MatExpansionModule } from '@angular/material/expansion';
import { Artist } from '../../../models/artist.model';
import { FirestoreService } from '../../../services/firestore.service';
import { take, merge } from 'rxjs';
import { AsyncPipe, JsonPipe, NgStyle } from '@angular/common';
import { ArtistIdFeatured } from '../../../models/artist-id-featured.model';
import { ArtistBioComponent } from './artist-bio/artist-bio.component';
import { MatDialog } from '@angular/material/dialog';
import { AddConcertComponent } from './add-concert/add-concert.component';
import { CapitalizeNamePipe } from '../../../pipes/capitalize-name.pipe';
import { ThisSundayComponent } from '../../../this-sunday/this-sunday.component';
import { AdminStore } from '../../admin/admin.store';
import { Auth } from '@angular/fire/auth';
import { AuthStore } from '../../../auth/auth.store';
import { VisitorService } from '../../visitor/visitor.service';
import { Observable } from 'tinymce';
import { FirebaseError } from '@angular/fire/app';
import { CalendarService } from '../../../services/calendar.service';
import { DocumentReference } from '@angular/fire/firestore';
import { MatIconModule } from '@angular/material/icon';
import { ConfirmDialogComponent } from '../../admin/shared/confirm-dialog/confirm-dialog.component';



@Component({
    selector: 'app-date',
    standalone: true,
    imports: [
        MatExpansionModule,
        JsonPipe,
        ArtistBioComponent,
        NgStyle,
        CapitalizeNamePipe,
        AsyncPipe,
        MatIconModule
    ],
    templateUrl: './date.component.html',
    styleUrl: './date.component.scss',
    // encapsulation: ViewEncapsulation.None
})
export class DateComponent implements OnInit {
    @Input() public concert!: Concert;
    featuredArtists: Artist[] = [];
    artists: Artist[] = [];
    // artists: Observable<Artist[]>;

    adminStore = inject(AdminStore)
    fs = inject(FirestoreService);
    dialog = inject(MatDialog)
    isExpanded: boolean = false;
    selectedDateNumber: number;
    auth = inject(Auth)
    authStore = inject(AuthStore);
    visitorService = inject(VisitorService)
    calendarService = inject(CalendarService)




    ngOnInit(): void {
        // console.log(this.concert)
        if (this.concert.artistsIdFeatured.length) {
            this.updateProgram()
        }
        this.dateIsExpanded()
    }

    onDate(e: Event) {

        if (this.authStore.isLoggedIn()) {
            e.stopPropagation();

            const dialogRef = this.dialog.open(AddConcertComponent, {
                data: { concert: this.concert },
                width: '40rem',
                maxWidth: '60rem'
            })
            dialogRef.afterClosed().subscribe((concert: Concert) => {
                // console.log(concert);
                if (concert && concert.id) {
                    this.updateConcert(concert)
                        .then((res: any) => {
                            console.log(`concert updated: ${res} `)
                            this.updateLocal(concert);
                        })
                        .catch((err: FirebaseError) => {
                            console.error(`failed to update concert: ${err.message}`)
                        })
                } else if (concert && !concert.id) {
                    this.addConcert(concert)
                        .then((docRef: DocumentReference) => {
                            console.log(`concert added: ${docRef.id} `)
                            this.concert.id = docRef.id;
                            this.updateLocal(concert);
                        })
                        .catch((err: FirebaseError) => {
                            console.error(`failed to update concert: ${err.message}`)
                        })
                }
            })
        }
    }


    private updateConcert(concert: Concert) {
        const path = `concerts-2024/${concert.id}`
        return this.fs.setDoc(path, concert)


    }
    private addConcert(concert: Concert) {
        const path = `concerts-2024`
        return this.fs.addDoc(path, concert)

    }

    onDateSelected(e: Event, concert: Concert) {
        e.stopPropagation();
        // console.log(e, concert)
        this.selectedDateNumber = this.concert.date.getDate()
        this.adminStore.setSelectedDateNumber(this.concert.date.getDate());
    }
    dateIsExpanded() {

        const todayDate = new Date().getDate()
        const concertDate = this.concert.date.getDate()
        const todayMonth = new Date().getMonth()
        const concertMonth = this.concert.date.getMonth();
        if (concertDate > todayDate && concertDate < todayDate + 7 && todayMonth === concertMonth) {
            // this.isExpanded = true
        }
    }


    updateProgram() {
        this.artists = [];
        this.featuredArtists = [];
        if (this.concert.artistsIdFeatured.length) {
            this.concert.artistsIdFeatured.forEach((artistBooked: ArtistIdFeatured) => {
                console.log('updateProgram START: ', artistBooked);
                this.visitorService.getArtistById((artistBooked.artistId))
                    .then((artist: Artist) => {
                        this.artists.push(artist)
                        if (artistBooked.isFeatured) {
                            this.featuredArtists.push(artist);
                        }
                        console.log('updateProgram END: ', artistBooked);
                    });
            });
        }
    }

    updateLocal(concert: Concert) {
        console.log(`updateLocal()`)
        console.log(concert)
        this.artists = [];
        this.featuredArtists = [];
        // this.fs.getDoc(`concerts-2024/${concert.id}`)
        //     .subscribe((concert: Concert) => {
        //         console.log(concert);
        //         this.concert = concert
        //     })
        // return;
        if (this.concert.artistsIdFeatured.length) {
            // console.log(`if block`)
            // console.log(this.concert.artistsBooked)
            this.concert.artistsIdFeatured.forEach((artistBooked: ArtistIdFeatured) => {
                console.log('updateLocal START: ', artistBooked);
                this.visitorService.getArtistById((artistBooked.artistId))
                    .then((artist: Artist) => {

                        // console.log(artist.name)
                        this.artists.push(artist)
                        if (artistBooked.isFeatured) {
                            this.featuredArtists.push(artist);
                        }
                        console.log('updateLocal END: ', artistBooked);
                    });
            });
        }
    }



    getHeight() {
        const length = this.featuredArtists.length
        if (length === 1) {
            return null
        } else if (length === 2) {
            return 'height:3.5rempx'
        } else if (length === 3) {
            return 'height:5rem'
        } else if (length === 4) {
            return 'height:6rem'
        } else {
            return 'background-color:white'
        }
    }
}



