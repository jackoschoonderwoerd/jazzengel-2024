import { AfterViewInit, Component, inject, OnInit, ViewChild } from '@angular/core';
import { AdminStore } from '../../admin.store';
import { DatePipe, JsonPipe } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table'
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FirestoreService } from '../../../../services/firestore.service';
import { Appearance } from '../../../../models/appearance';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { Booking } from '../../../../models/booking.model';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { take } from 'rxjs';



import { MatSelectionListChange } from '@angular/material/list';





@Component({
    selector: 'app-musicians-appearance',
    imports: [
        MatFormFieldModule,
        MatInputModule,
        MatTableModule,
        MatSortModule,
        MatLabel,
        MatSelectModule,
        MatButtonModule,
        FormsModule,
        JsonPipe,
        DatePipe,
    ],
    templateUrl: './musicians-appearance.component.html',
    styleUrl: './musicians-appearance.component.scss'
})
export class MusiciansAppearanceComponent implements OnInit {
    adminStore = inject(AdminStore)
    dataSource!: MatTableDataSource<Appearance>;
    displayedColumns: string[] = ['name', 'instrument', 'date'];
    fs = inject(FirestoreService);
    @ViewChild(MatSort) sort!: MatSort;
    @ViewChild('queryInput') queryInput!: HTMLInputElement;
    names: string[] = [];
    instruments: string[] = [];
    appearances: Appearance[] = [];
    BdBSHidden: boolean = false;
    drumsHidden: boolean = false
    queryValue: string = ''


    ngOnInit(): void {
        const path = `bookings`;
        this.fs.collection(path).pipe(take(1)).subscribe((bookings: any) => {
            bookings.forEach((booking: any) => {

                this.appearances.push(this.extractAppearance(booking.booking));

            })
            this.extractNames(bookings);
            this.extractInstruments(bookings);
            this.dataSource = new MatTableDataSource(this.appearances)
            this.dataSource.sort = this.sort;
            this.onToggleBouwmeesterDeBooSchoonderwoerd()
        })
    }

    onInstrumentSelected(e: any) {
        const filterValue = e.value;
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }


    onNameSelected(e: any) {
        const filterValue = e.value
        this.dataSource.filter = filterValue.trim().toLowerCase()
    }
    onSeasonSelected(result: any) {
        console.log(result.value)
        // const dateRange: MyDateRange = result.value
    }
    onInputChange(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value
        this.dataSource.filter = filterValue.trim().toLowerCase()
    }

    private extractAppearance(booking: Booking) {
        const appearance: Appearance = {
            name: booking.artist.name,
            instrument: booking.artist.instrument,
            date: new Date(booking.date[2], booking.date[0] - 1, booking.date[1], 0, 0, 0, 0)
        }
        return appearance
    }

    private extractNames(bookings: any) {
        bookings.forEach((booking: any) => {
            const name = booking.booking.artist.name
            if (this.names.indexOf(name) === -1) {
                this.names.push(name)
            }
            this.names.sort();
        })
    }
    private extractInstruments(bookings: any) {
        bookings.forEach((booking: any) => {
            const instrument = booking.booking.artist.instrument
            if (this.instruments.indexOf(instrument) === -1) {
                this.instruments.push(instrument);
            }
            this.instruments.sort()
        });
    }


    onToggleBouwmeesterDeBooSchoonderwoerd() {
        this.hideBdBSfromNames();
        this.toggleBdBSFromAppearances();
        this.dataSource.sort = this.sort;
        this.queryValue = '';

    }

    private hideBdBSfromNames() {
        const BdBSHidden: string[] = [];
        this.names.forEach((name: string) => {
            if (name.trim().toLowerCase() !== 'jacko schoonderwoerd' &&
                name.trim().toLowerCase() !== 'leo bouwmeester' &&
                name.trim().toLowerCase() !== 'victor de boo') {
                BdBSHidden.push(name)
            }
        })
        this.names = BdBSHidden
    }

    private toggleBdBSFromAppearances() {
        if (!this.BdBSHidden) {
            const BdbSHiddenFromAppearances: Appearance[] = []
            this.appearances.forEach((appearance: Appearance) => {
                if (appearance.name.trim().toLowerCase() !== 'jacko schoonderwoerd' &&
                    appearance.name.trim().toLowerCase() !== 'leo bouwmeester' &&
                    appearance.name.trim().toLowerCase() !== 'victor de boo') {
                    BdbSHiddenFromAppearances.push(appearance)
                }
            })
            this.dataSource = new MatTableDataSource(BdbSHiddenFromAppearances)
        } else {
            this.dataSource = new MatTableDataSource(this.appearances)
        }
        this.BdBSHidden = !this.BdBSHidden
    }
    pickerResult(result: any) {
        console.log(result.value)
    }

}

