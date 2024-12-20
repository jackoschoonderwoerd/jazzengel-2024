import { AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FirestoreService } from '../../../../services/firestore.service';
import { Concert } from '../../../../models/concert.model';
import { ArtistIdFeatured } from '../../../../models/artist-id-featured.model';
import { Artist } from '../../../../models/artist.model';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import * as XLSX from 'xlsx'
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormsModule } from '@angular/forms';
import { take } from 'rxjs';


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
        MatCheckboxModule,
        MatSlideToggleModule,
        FormsModule
    ],
    templateUrl: './appearance.component.html',
    styleUrl: './appearance.component.scss'
})
export class AppearanceComponent implements OnInit, AfterViewInit {

    dataSourceConcerts: DataSourceConcert[] = []
    @ViewChild(MatSort) sort: MatSort;
    dataSource = new MatTableDataSource<DataSourceConcert>();
    displayedColumns: string[] = ['date', 'name', 'instrument', 'isFeatured'];
    featuredFilter: boolean = false
    file: File;
    @ViewChild('div') div: ElementRef;
    isChecked: boolean = false;

    constructor(
        private fs: FirestoreService,
        private renderer: Renderer2,
        private http: HttpClient
    ) { }

    ngOnInit(): void {

        const path = `concerts-2024`
        this.fs.collection(path).pipe(take(1)).subscribe((concerts: Concert[]) => {
            concerts.sort((a, b) => a.timestamp - b.timestamp)
            concerts.forEach((concert: any) => {
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
                        const JSONData = JSON.stringify(this.dataSourceConcerts)
                        // console.log(JSONData)
                        this.dataSource.data = this.dataSourceConcerts
                        this.file = new File([JSONData], 'concerts.json')
                    })
                })
            });
        })
    }

    ngAfterViewInit(): void {
        this.dataSource.sort = this.sort;
    }

    doFilter(filterValue: string) {
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    onSlideChange(e: boolean) {
        console.log(e);
        if (e) {
            this.dataSource.filter = 'featured';
            this.featuredFilter = true;
        } else {
            this.dataSource.filter = '';
            this.featuredFilter = true;
        }
    }


    fileName = 'jazzengel.xlsx'

    // Excel: https://www.youtube.com/watch?v=j2gQArYvgw0

    exportExcel() {
        let data = document.getElementById('table-data');
        const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(data);

        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

        XLSX.writeFile(wb, this.fileName)
    }


}
