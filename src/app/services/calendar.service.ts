import { inject, Injectable } from '@angular/core';
import { AdminStore } from '../components/admin/admin.store';
import { FirestoreService } from './firestore.service';
import { Concert } from '../models/concert.model';

@Injectable({
    providedIn: 'root'
})
export class CalendarService {

    adminStore = inject(AdminStore);
    fs = inject(FirestoreService)
    constructor() { }


    getCalendar() {
        // 001
        this.getSundaysNowPlusYear().then((dates: any) => {
            return dates
        }).then((dates: Date[]) => {
            // 002
            return this.addEmptyArtistsBookedArrayToDates(dates)
        }).then((concerts: any) => {
            console.log(concerts)
            // 003
            return this.combineDatesAndConcerts(concerts)
        }).then((concerts: any) => {
            // 004
            this.getConcertNextSunday(concerts)
            return this.distributeSundaysByMonth(concerts)
        }).then((concerts: any) => {
            // 005
            return this.sortConcerts(concerts)
        }).then((sortedConcerts: any) => {
            // console.log(sortedConcerts)
            this.adminStore.loadSortedConcerts(sortedConcerts)
        })
    }

    // 001
    private getSundaysNowPlusYear() {
        // console.log(this.adminStore.visibleWeeksAhead());
        const promise = new Promise((resolve, reject) => {

            var date = new Date();
            date.setDate(date.getDate() - date.getDay() + 7); //start at next sunday


            var dates = [];



            var today = new Date()
            if (today.getDay() === 0 && today.getHours() < 19) { // IF TODAY IS A SUNDAY EARLIER THAN 19:00
                dates.push(today)
                // console.log(today.getHours())
            }
            // console.log(date.getDay())

            for (var i = 0; i < this.adminStore.visibleWeeksAhead(); i++) {
                dates.push(new Date(date));
                date.setDate(date.getDate() + 7); //add a week
                // console.log(dates[0])
            }
            resolve(dates)
        })
        return promise


    }
    // 002
    private addEmptyArtistsBookedArrayToDates(dates: Date[]) {
        const concerts: Concert[] = []
        const promise = new Promise((resolve, reject) => {
            for (var i = 0; i < 50; i++) {
                const concert: Concert = {
                    date: new Date(dates[i]),
                    artistsBooked: [

                        { artistId: 'VU0hRYdxfsjoL5BkRzwx', isFeatured: true }, // Leo
                        { artistId: '220I8XV6VBgG1CjjlFRe', isFeatured: false }, // Leo
                        { artistId: 'PnuTe0oJsJ1gQaA6uUuU', isFeatured: false }, // Jacko
                        { artistId: '8dUKRdXtgN5ENUX4mASs', isFeatured: false }, // Victor
                    ]
                }
                concerts.push(concert)
                resolve(concerts)
            }
        })
        return promise
    }
    // 004
    private distributeSundaysByMonth(concerts: Concert[]) {
        // console.log(concerts)
        const sundaysPerMonth: Concert[][] = [
            [], [], [], [], [], [], [], [], [], [], [], []
        ]
        // concerst = dates.sort()
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

        // sundaysPerMonth.sort((a: Date[], b: Date[]) => new Date(a[0]).getTime() - new Date(b[0]).getTime())
        return sundaysPerMonth
    }


    // 003
    combineDatesAndConcerts(emptyConcerts: Concert[]) {
        const promise = new Promise((resolve, reject) => {
            let combinedConcerts: Concert[] = []
            // console.log(emptyConcerts)

            this.fs.collection(`concerts`).subscribe((bookedConcerts: any[]) => {
                bookedConcerts.forEach((bookedConcert: any) => {
                    bookedConcert.date = new Date(bookedConcert.date.seconds * 1000)
                })

                emptyConcerts.forEach((emptyConcert: Concert, index: number) => {
                    bookedConcerts.forEach((bookedConcert: Concert) => {
                        if (
                            emptyConcert.date.getFullYear() === new Date(bookedConcert.date).getFullYear() &&
                            emptyConcert.date.getMonth() === new Date(bookedConcert.date).getMonth() &&
                            emptyConcert.date.getDate() === new Date(bookedConcert.date).getDate()
                        ) {
                            // console.log(bookedConcert)
                            emptyConcerts[index].artistsBooked = bookedConcert.artistsBooked
                            emptyConcerts[index].id = bookedConcert.id

                        } else {
                            // console.log('no match');
                        }
                    })
                })
                // console.log(emptyConcerts)
                combinedConcerts = emptyConcerts;

                resolve(combinedConcerts);
            })
        })
        return promise

    }
    // 005
    sortConcerts(concertArrays: Concert[][]) {
        const notEmptyConcertArrays: Concert[][] = []
        concertArrays.forEach((concertArray: Concert[]) => {
            if (concertArray.length) {
                notEmptyConcertArrays.push(concertArray)

            }
        })
        const promise = new Promise((resolve, reject) => {
            notEmptyConcertArrays.sort((a: Concert[], b: Concert[]) => new Date(a[0].date).getTime() - new Date(b[0].date).getTime());
            resolve(notEmptyConcertArrays)
        })
        return promise
    }
    getConcertNextSunday(concerts: Concert[]) {
        console.log(concerts);
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
}
