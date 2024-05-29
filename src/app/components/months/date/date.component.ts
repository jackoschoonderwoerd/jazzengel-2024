import { Component, inject, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { Concert } from '../../../models/concert.model';
import { MatExpansionModule } from '@angular/material/expansion';
import { Artist } from '../../../models/artist.model';
import { FirestoreService } from '../../../services/firestore.service';
import { take } from 'rxjs';
import { JsonPipe, NgStyle } from '@angular/common';
import { ArtistBooked } from '../../../models/artist-booked.model';
import { ArtistBioComponent } from './artist-bio/artist-bio.component';
import { MatDialog } from '@angular/material/dialog';
import { AddConcertComponent } from '../../admin/add-concert/add-concert.component';
import { CapitalizeNamePipe } from '../../../pipes/capitalize-name.pipe';

@Component({
    selector: 'app-date',
    standalone: true,
    imports: [
        MatExpansionModule,
        JsonPipe,
        ArtistBioComponent,
        NgStyle,
        CapitalizeNamePipe
    ],
    templateUrl: './date.component.html',
    styleUrl: './date.component.scss',
    // encapsulation: ViewEncapsulation.None
})
export class DateComponent implements OnInit {
    @Input() public concert!: Concert;
    featuredArtists: Artist[] = [];
    artists: Artist[] = [];
    fs = inject(FirestoreService);
    dialog = inject(MatDialog)


    ngOnInit(): void {

        if (this.concert.artistsBooked.length) {
            this.updateProgram()
        }
    }

    onDate(e: Event) {
        e.stopPropagation();
        console.log(this.concert)
        const dialogRef = this.dialog.open(AddConcertComponent, {
            data: { concert: this.concert },
            width: '40rem',
            maxWidth: '60rem'
        })
        dialogRef.afterClosed().subscribe((data) => {
            console.log(data)
            this.updateProgram();
        })
    }

    updateProgram() {
        this.artists = [];
        this.featuredArtists = [];
        if (this.concert.artistsBooked.length) {
            // console.log(this.concert.artistsBooked)
            this.concert.artistsBooked.forEach((artistBooked: ArtistBooked) => {
                const path = `artists/${artistBooked.artistId}`
                this.fs.getDoc(path).pipe(take(1)).subscribe((artist: Artist) => {
                    this.artists.push(artist)
                    if (artistBooked.isFeatured) {
                        this.featuredArtists.push(artist);
                    }
                })
            })
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

