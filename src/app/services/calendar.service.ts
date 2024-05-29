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
            // 003
            return this.combineDatesAndConcerts(concerts)
        }).then((concerts: any) => {
            // 004
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
        const promise = new Promise((resolve, reject) => {

            var date = new Date();
            date.setDate(date.getDate() - date.getDay()); //start at last sunday

            var dates = [];
            // var concerts: Concert[] = [];
            for (var i = 0; i < 50; i++) {
                // const concert: Concert = {
                //     date: new Date(date),
                //     artistsBooked: []
                // }
                // concerts.push(concert)
                dates.push(new Date(date));
                date.setDate(date.getDate() + 7); //add a week

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
                    artistsBooked: []
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
                console.log(bookedConcerts[0])
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
    sortConcerts(concerts: Concert[][]) {
        const promise = new Promise((resolve, reject) => {
            concerts.sort((a: Concert[], b: Concert[]) => new Date(a[0].date).getTime() - new Date(b[0].date).getTime());
            resolve(concerts)
        })
        return promise
    }
}
