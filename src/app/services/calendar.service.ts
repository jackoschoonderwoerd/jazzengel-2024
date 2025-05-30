import { inject, Injectable } from '@angular/core';
import { AdminStore } from '../components/admin/admin.store';
import { FirestoreService } from './firestore.service';
import { Concert } from '../models/concert.model';
import { Artist } from '../models/artist.model';



@Injectable({
    providedIn: 'root'
})
export class CalendarService {

    adminStore = inject(AdminStore);
    fs = inject(FirestoreService);
    concerts: Concert[] = [];
    constructor() { }
    allArtists: Artist[] = [];

    getNextSundayTimestamp(fromDate = new Date()) {
        const date = new Date(fromDate);
        const day = date.getDay(); // 0 = Sunday, 6 = Saturday
        const daysUntilNextSunday = (7 - day) % 7 || 7;
        date.setDate(date.getDate() + daysUntilNextSunday);
        console.log(date)
        const timestampNextSunday = Math.floor(date.getTime());
        console.log(timestampNextSunday)
        return timestampNextSunday;
    }


    getCalendar(monthsBefore: number, monthsAhead: number) {
        this.getNextSundayTimestamp()
        console.log('getCalendar()')
        console.log('MONTHSAHEAD: ', monthsAhead)
        const start: number = new Date().getTime()
        this.adminStore.setIsLoading(true)

        let autoGeneratedConcerts: Concert[] = [];
        let sortedAutoGeneratedConcerts: Concert[][] = [];


        const now: Date = new Date(new Date().setHours(0, 0, 0, 0))
        // const firstSundayTimestamp = now.setDate(now.getDate() - now.getDay()); //start at next sunday

        const firstSundayTimestamp = this.getNextSundayTimestamp()


        console.log(firstSundayTimestamp);
        console.log(new Date(firstSundayTimestamp))

        const firstSundayDate = new Date(firstSundayTimestamp)


        const rangeStartDate: Date = new Date(firstSundayDate.setHours(0, 0, 0, 0))
        const rangeStartTimestamp = rangeStartDate.getTime();

        const rangeEndDate: Date = new Date(now.getFullYear(), now.getMonth() + monthsAhead, now.getDate());
        const rangeEndTimestamp = rangeEndDate.getTime()

        const numberOfWeeksinRange = monthsAhead * 4;

        const sundaysTimestamp: number[] = []


        for (var i = 0; i < numberOfWeeksinRange; i++) {
            sundaysTimestamp.push((new Date(firstSundayDate).setHours(0, 0, 0, 0)));
            firstSundayDate.setDate(firstSundayDate.getDate() + 7); //add a week
        }

        sundaysTimestamp.forEach((sundayTimestamp: number) => {
            const concert: Concert = {
                date: new Date(sundayTimestamp),
                timestamp: sundayTimestamp,
                artistsIdFeatured: [
                    { artistId: 'VU0hRYdxfsjoL5BkRzwx', isFeatured: true }, // TBA
                    { artistId: '220I8XV6VBgG1CjjlFRe', isFeatured: false }, // Leo
                    { artistId: 'PnuTe0oJsJ1gQaA6uUuU', isFeatured: false }, // Jacko
                    { artistId: '8dUKRdXtgN5ENUX4mASs', isFeatured: false }, // Victor
                ],
            }
            const end: number = new Date().getTime();
            // console.log(`DIFFERENCE:`, end - start)
            autoGeneratedConcerts.push(concert)
        })


        this.getConcertsWithinRange(rangeStartTimestamp, rangeEndTimestamp)
            .subscribe(((bookedConcerts: Concert[]) => {
                console.log('OBSERVABLE: ', bookedConcerts);
                autoGeneratedConcerts.forEach((autoGeneratedConcert: Concert, index) => {
                    bookedConcerts.forEach((bookedConcert: Concert) => {
                        // // console.log(bookedConcert)
                        if (autoGeneratedConcert.timestamp === bookedConcert.timestamp) {
                            autoGeneratedConcerts[index].artistsIdFeatured = bookedConcert.artistsIdFeatured;
                            autoGeneratedConcerts[index].id = bookedConcert.id
                        }
                    })
                })
                sortedAutoGeneratedConcerts = this.sortConcertsByMonth(autoGeneratedConcerts)
                this.adminStore.setIsLoading(false)

                this.sortSortedAutoGeneratedConcerts(sortedAutoGeneratedConcerts);
                this.adminStore.storeSortedConcerts(sortedAutoGeneratedConcerts);
            }));
    }


    // CHATGPT
    // Comparator function to compare the first objects in each inner array by their 'timestamp' property
    private compareFirstMonthByTimestamp(month1: Concert[], month2: Concert[]) {
        // Access the 'timestamp' property of the first object in each array
        const timestamp1 = month1[0].timestamp;
        const timestamp2 = month2[0].timestamp;

        // Comparison logic
        if (timestamp1 < timestamp2) return -1; // If age1 is less than age2, arr1 should come before arr2
        if (timestamp1 > timestamp2) return 1;  // If age1 is greater than age2, arr1 should come after arr2
        return 0;                   // If ages are equal, the order doesn't change
    }

    // Sort the array using the custom comparator
    private sortSortedAutoGeneratedConcerts(sortedAutoGeneratedConcerts: Concert[][]) {
        sortedAutoGeneratedConcerts.sort(this.compareFirstMonthByTimestamp);
        // console.log(sortedAutoGeneratedConcerts);
    }

    getConcertsWithinRange(firstSundayTimestamp: number, lastSundayTimestamp: Number) {
        const path = `concerts-2024`;
        return this.fs.getCollectionWithinRange(
            path,
            'timestamp',
            firstSundayTimestamp,
            lastSundayTimestamp
        )
    }

    private sortConcertsByMonth(concerts: Concert[]) {
        let sundaysPerMonth: Concert[][] = [
            [], [], [], [], [], [], [], [], [], [], [], []
        ]
        concerts.forEach((concert: Concert) => {

            switch (new Date(concert.date).getMonth()) {
                case 0:
                    sundaysPerMonth[0].push(concert);
                    break;
                case 1:
                    sundaysPerMonth[1].push(concert);
                    break;
                case 2:
                    sundaysPerMonth[2].push(concert);
                    break;
                case 3:
                    sundaysPerMonth[3].push(concert);
                    break;
                case 4:
                    sundaysPerMonth[4].push(concert);
                    break;
                case 5:
                    sundaysPerMonth[5].push(concert);
                    break;
                case 6:
                    sundaysPerMonth[6].push(concert);
                    break;
                case 7:
                    sundaysPerMonth[7].push(concert);
                    break;
                case 8:
                    sundaysPerMonth[8].push(concert);
                    break;
                case 9:
                    sundaysPerMonth[9].push(concert);
                    break;
                case 10:
                    sundaysPerMonth[10].push(concert);
                    break;
                case 11:
                    sundaysPerMonth[11].push(concert);
                    break;
                default:
            }
        })

        sundaysPerMonth = this.removeEmptyArrays(sundaysPerMonth)
        return sundaysPerMonth
    }

    private removeEmptyArrays(sundaysPerMonth: Concert[][]) {
        return sundaysPerMonth = sundaysPerMonth.filter(month => !Array.isArray(month) || month.length !== 0);
    }
}
