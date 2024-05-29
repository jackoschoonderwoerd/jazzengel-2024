import { Component, inject, OnInit } from '@angular/core';
import { AdminStore } from '../admin//admin.store';
import { DatePipe, JsonPipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';



import { FirestoreService } from '../../services/firestore.service';


import { MatButtonModule } from '@angular/material/button';
import { CalendarService } from '../../services/calendar.service';
// import { MonthComponent } from './month/month.componentXXX';
import { MatExpansionModule } from '@angular/material/expansion';
import { MonthPipe } from '../../pipes/month.pipe';
import { DateComponent } from './date/date.component';

@Component({
    selector: 'app-concerts',
    standalone: true,
    imports: [
        DatePipe,
        MatButtonModule,
        JsonPipe,
        // MonthComponent,
        MatExpansionModule,
        MonthPipe,
        DateComponent
    ],
    templateUrl: './months.component.html',
    styleUrl: './months.component.scss'
})
export class MonthsComponent implements OnInit {
    adminStore = inject(AdminStore);
    dialog = inject(MatDialog);
    fs = inject(FirestoreService)
    calendarService = inject(CalendarService)
    dates: any


    ngOnInit(): void {
        this.adminStore.loadConcerts();
        this.dates = this.calendarService.getCalendar();
    }

}
