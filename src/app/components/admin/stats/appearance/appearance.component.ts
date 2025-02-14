import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FirestoreService } from '../../../../services/firestore.service';
import { Concert } from '../../../../models/concert.model';
import { ArtistIdFeatured } from '../../../../models/artist-id-featured.model';
import { Artist } from '../../../../models/artist.model';
import { MatTable, MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { DatePipe } from '@angular/common';
import * as XLSX from 'xlsx'
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormsModule } from '@angular/forms';
import { take } from 'rxjs';
import { MatDatepickerModule } from '@angular/material/datepicker';


interface DataSourceConcert {
    date: Date;
    name: string;
    instrument: string;
    isFeatured: string;
}

@Component({
    selector: 'app-appearance',
    imports: [MatTableModule,
        MatSortModule,
        MatIconModule,
        MatFormFieldModule,
        MatInput,
        MatButtonModule,
        DatePipe,
        MatSlideToggleModule,
        FormsModule,
        MatDatepickerModule,
    ],
    templateUrl: './appearance.component.html',
    styleUrl: './appearance.component.scss'
})
export class AppearanceComponent implements OnInit, AfterViewInit {

    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatTable) table: MatTable<any>;
    dataSourceConcerts: DataSourceConcert[] = []
    dataSource = new MatTableDataSource<DataSourceConcert>();
    displayedColumns: string[] = ['date', 'name', 'instrument', 'isFeatured'];
    featuredFilter: boolean = false
    featuredFilterChecked: boolean = true;
    filterValue: string = '';
    startDate: Date;
    endDate: Date;

    constructor(
        private fs: FirestoreService,
    ) { }

    ngOnInit(): void {
        this.initDateRange(2)
    }

    getAppearances(startTimestamp: number, endTimestamp: number) {
        this.dataSourceConcerts = [];
        const path = `concerts-2024`
        this.fs.getCollectionWithinRange(path, 'timestamp', startTimestamp, endTimestamp).pipe(take(1)).subscribe((concerts: Concert[]) => {
            concerts.sort((a, b) => a.timestamp - b.timestamp)
            concerts.forEach((concert: any) => {
                // console.log(new Date(concert.timestamp))
                concert.artistsIdFeatured.forEach((artistIdFeatured: ArtistIdFeatured) => {
                    const path = `artists/${artistIdFeatured.artistId}`
                    this.fs.getDoc(path).pipe(take(1)).subscribe((artist: Artist) => {
                        const dataSourceConcert: DataSourceConcert = {
                            date: new Date(concert.timestamp),
                            name: artist.name,
                            instrument: artist.instrument,
                            isFeatured: artistIdFeatured.isFeatured ? 'featured' : ''
                        }
                        this.dataSourceConcerts.push(dataSourceConcert)
                        this.dataSource.data = this.dataSourceConcerts
                        this.table.renderRows();
                    })
                })
            });
        })
    }

    ngAfterViewInit(): void {
        this.dataSource.sort = this.sort;
    }

    doFilter(filterValue: string) {
        this.featuredFilterChecked = false;
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    onSlideChange(e: boolean) {
        this.filterValue = '';
        if (e) {
            this.dataSource.filter = 'featured';
            this.featuredFilter = true;
        } else {
            this.dataSource.filter = '';
            this.featuredFilter = true;
        }
    }

    initDateRange(monthsAhead: number) {
        const monthsFromNow = new Date().getMonth() + monthsAhead;
        const yesterdayDate = new Date().getDate() - 1;

        const dateYesterday = new Date().setDate(yesterdayDate)
        const dateTwoMonthsFromNow = new Date().setMonth(monthsFromNow);


        this.startDate = new Date(dateYesterday);
        this.endDate = new Date(dateTwoMonthsFromNow)

        console.log(this.startDate, this.endDate)

        this.getAppearances(new Date(dateYesterday).getTime(), new Date(dateTwoMonthsFromNow).getTime());
        this.onSlideChange(true);
    }

    onDateRangeChange(dateRangeStart: Date, dateRangeEnd: Date) {
        this.getAppearances(new Date(dateRangeStart).getTime(), new Date(dateRangeEnd).getTime())
    }


    // Excel: https://www.youtube.com/watch?v=j2gQArYvgw0
    fileName = 'jazzengel.xlsx'

    exportExcel() {
        let data = document.getElementById('table-data');
        const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(data);

        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

        XLSX.writeFile(wb, this.fileName)
    }


}
