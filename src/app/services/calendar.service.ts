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
    concerts: Concert[] = []
    constructor() { }
    allArtists: Artist[] = []



    getCalendar(monthsBefore: number, monthsAhead: number) {
        this.adminStore.setIsLoading(true)
        console.log(monthsBefore, monthsAhead)
        let defaultSundays: Concert[] = [];
        let sundaysWithArtistIds: Concert[] = []
        const today: Date = new Date(new Date().setHours(0, 0, 0, 0))
        const rangeStart: Date = new Date(today.getFullYear(), today.getMonth() - monthsBefore, today.getDate())

        const rangeEnd: Date = new Date(today.getFullYear(), today.getMonth() + monthsAhead, today.getDate())
        this.fs.asyncCollection(`artists`).then((artists: Artist[]) => {
            this.allArtists = artists
        })
            .then(() => {
                return this.createSundaysWithinRange(rangeStart, rangeEnd)
            })
            .then((emptySundays: Date[]) => {
                return this.addDefaultBand(emptySundays)
            })
            .then((defaultSundays_: Concert[]) => {
                defaultSundays = defaultSundays_;
                return this.getConcertsWithinRange(rangeStart, rangeEnd)


            })
            .then((concertsWithinRange: Concert[]) => {
                concertsWithinRange.forEach((concertWithinRange: Concert) => {
                    concertWithinRange.date = new Date(concertWithinRange.timestamp)
                })
                defaultSundays.forEach((defaultSunday: Concert, index) => {
                    concertsWithinRange.forEach((concertWithinRange: Concert) => {
                        if (defaultSunday.date.getTime() === concertWithinRange.date.getTime()) {
                            defaultSundays[index].artistsIdFeatured = concertWithinRange.artistsIdFeatured;
                        } else {
                            console.log('no match')
                        }
                    })
                })
                sundaysWithArtistIds = defaultSundays;
                return sundaysWithArtistIds
            }).then((concerts: Concert[]) => {
                return this.sortConcertsByMonth(concerts)
            }).then((concertsSortedByMonth: any) => {
                console.log(concertsSortedByMonth)
                this.adminStore.storeSortedConcerts(concertsSortedByMonth);
                this.adminStore.setIsLoading(false)

            })
    }

    private createSundaysWithinRange(startDate: Date, endDate: Date) {
        console.log(startDate)
        const calculatedNumberOfWeeks = (this.getNumberOfWeeksBetweenDates(startDate, endDate))

        console.log(calculatedNumberOfWeeks);
        const promise = new Promise((resolve, reject) => {

            var date = new Date();
            const nextSunday = date.setDate(date.getDate() - date.getDay() + 7); //start at next sunday

            const firstSunday = new Date(startDate.setDate(startDate.getDate() - startDate.getDay() + 7)).setHours(0, 0, 0, 0); //start at next sunday
            console.log(firstSunday)
            var sundays = [];

            if (new Date(firstSunday).getDay() === 0 && new Date(firstSunday).getHours() < 19) { // IF TODAY IS A SUNDAY EARLIER THAN 19:00
                // sundays.push(firstSunday)
                // console.log(today.getHours())
            }
            // console.log(date.getDay())

            for (var i = 0; i < calculatedNumberOfWeeks; i++) {
                sundays.push(new Date(new Date(date).setHours(0, 0, 0, 0)));
                date.setDate(date.getDate() + 7); //add a week
                // console.log(dates[0])
            }
            resolve(sundays)
        })
        return promise
    }
    private getNumberOfWeeksBetweenDates(date1: Date, date2: Date) {
        // Parse the dates
        const d1 = new Date(date1).getTime();
        const d2 = new Date(date2).getTime();
        // Calculate the difference in milliseconds
        const diffInMs = Math.abs(d2 - d1);
        // Convert milliseconds to weeks
        const msInWeek = 1000 * 60 * 60 * 24 * 7;
        const weeks = Math.round(diffInMs / msInWeek);
        return weeks;
    }

    private addDefaultBand(emptySundays: Date[]): Promise<unknown> {
        const concerts: Concert[] = []
        const promise = new Promise((resolve, reject) => {
            for (let i = 0; i < emptySundays.length; i++) {
                console.log(emptySundays[i])

                const concert: Concert = {
                    date: new Date(emptySundays[i]),
                    artistsIdFeatured: [

                        { artistId: 'VU0hRYdxfsjoL5BkRzwx', isFeatured: true }, // TBA
                        { artistId: '220I8XV6VBgG1CjjlFRe', isFeatured: false }, // Leo
                        { artistId: 'PnuTe0oJsJ1gQaA6uUuU', isFeatured: false }, // Jacko
                        { artistId: '8dUKRdXtgN5ENUX4mASs', isFeatured: false }, // Victor
                    ]
                }
                concerts.push(concert)
            }
            resolve(concerts)
        })
        return promise
    }


    private getConcertsWithinRange(firstSunday: Date, lastSunday: Date) {
        console.log(firstSunday)
        const promise = new Promise((resolve, reject) => {

            const firstSundayTimestamp = firstSunday.getTime();
            const lastSundayTimestamp = lastSunday.getTime();
            const path = `concerts-2024`;
            console.log(firstSundayTimestamp, typeof (firstSundayTimestamp))
            console.log(lastSundayTimestamp, typeof (lastSundayTimestamp))
            return this.fs.asyncCollectionByRange
                (
                    path,
                    'timestamp',
                    firstSundayTimestamp,
                    lastSundayTimestamp
                ).then((concertsWithinRange: Concert[]) => {
                    resolve(concertsWithinRange)
                })
        })
        return promise
    }

    private sortConcertsByMonth(concerts: Concert[]) {
        let sundaysPerMonth: Concert[][] = [
            [], [], [], [], [], [], [], [], [], [], [], []
        ]
        concerts.forEach((concert: Concert) => {

            switch (concert.date.getMonth()) {
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

    getConcertNextSunday(concerts: Concert[]) {
        var date = new Date();
        date.setDate(date.getDate() - date.getDay() + 7);
        const nextSunday: Date = date
        const index = concerts.findIndex((concert: Concert) => {
            return nextSunday.getDay() === concert.date.getDay() && nextSunday.getMonth() === concert.date.getMonth()
        });
        // concerts.forEach((concert: Concert) => {
        //     console.log(concert.date.getTime())
        //     console.log(nextSunday.getTime())
        // })
        this.adminStore.setConcertThisSunday(concerts[index]);
        // console.log(concerts[index])
        // return(concerts[index])
    }


    // combineDatesAndConcerts(emptyConcerts: Concert[]) {
    //     const promise = new Promise((resolve, reject) => {
    //         let combinedConcerts: Concert[] = []
    //         this.fs.collection(`concerts`).subscribe((bookedConcerts: any[]) => {
    //             bookedConcerts.forEach((bookedConcert: any) => {
    //                 bookedConcert.date = new Date(bookedConcert.date.seconds * 1000)
    //             })

    //             emptyConcerts.forEach((emptyConcert: Concert, index: number) => {
    //                 bookedConcerts.forEach((bookedConcert: Concert) => {
    //                     if (
    //                         emptyConcert.date.getFullYear() === new Date(bookedConcert.date).getFullYear() &&
    //                         emptyConcert.date.getMonth() === new Date(bookedConcert.date).getMonth() &&
    //                         emptyConcert.date.getDate() === new Date(bookedConcert.date).getDate()
    //                     ) {
    //                         emptyConcerts[index].artistsIdFeatured = bookedConcert.artistsIdFeatured
    //                         emptyConcerts[index].id = bookedConcert.id

    //                     }
    //                 })
    //             })
    //             combinedConcerts = emptyConcerts;

    //             resolve(combinedConcerts);
    //         })
    //     })
    //     return promise
    // }








    // 005


    // sortConcerts(concertArrays: Concert[][]) {
    //     const notEmptyConcertArrays: Concert[][] = []
    //     concertArrays.forEach((concertArray: Concert[]) => {
    //         if (concertArray.length) {
    //             notEmptyConcertArrays.push(concertArray)

    //         }
    //     })
    //     const promise = new Promise((resolve, reject) => {
    //         notEmptyConcertArrays.sort((a: Concert[], b: Concert[]) => new Date(a[0].date).getTime() - new Date(b[0].date).getTime());
    //         resolve(notEmptyConcertArrays)
    //     })
    //     return promise
    // }

    // private combineSundaysWithConcerts(sundays: Date[], fieldName: string, startDate: Date, endDate: Date) {
    //     const combinedConcerts: ConcertArtistsComplete[] = []
    //     const path = 'concerts';
    //     const newDate = new Date().setHours(0, 0, 0, 0,)
    //     console.log(new Date(newDate))

    //     this.fs.asyncCollectionByDateRange(path, 'date', startDate, endDate).then((concerts: Concert[]) => {
    //         console.log(concerts);
    //         sundays.forEach((sunday: Date) => {
    //             const combinedConcert: ConcertArtistsComplete = {
    //                 date: sunday,
    //                 artists: []
    //             }
    //             concerts.forEach((concert: Concert) => {

    //                 if (new Date(sunday).getFullYear() === new Date(concert.date).getFullYear() &&
    //                     new Date(sunday).getMonth() === new Date(concert.date).getMonth() &&
    //                     new Date(sunday).getDate() === new Date(concert.date).getDate()) {
    //                     console.log(concert)
    //                 } else {
    //                     console.log('no match')
    //                 }
    //             })
    //         })
    //     })
    // }



    // private sortSundaysByMonth(sundays: Date[]) {
    //     sundays.forEach((sunday: Date) => {
    //         console.log(sunday.getMonth())
    //     })
    // }

}
