import { Component, inject, OnInit } from '@angular/core';
import { AdminStore } from '../admin//admin.store';
import { DatePipe, JsonPipe, NgFor } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';



import { FirestoreService } from '../../services/firestore.service';


import { MatButtonModule } from '@angular/material/button';
import { CalendarService } from '../../services/calendar.service';
// import { MonthComponent } from './month/month.componentXXX';
import { MatExpansionModule } from '@angular/material/expansion';
import { MonthPipe } from '../../pipes/month.pipe';
import { DateComponent } from './date/date.component';
import { ThisSundayComponent } from '../../this-sunday/this-sunday.component';
import { FirebaseError } from '@angular/fire/app';
import { AuthStore } from '../../auth/auth.store';
import { STATE_SIGNAL } from '@ngrx/signals/src/state-signal';
import { NgForm } from '@angular/forms';

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
        DateComponent,
        NgFor
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
    isExpanded: boolean = false;
    selectedMonthNumber: number = new Date().getMonth();
    authStore = inject(AuthStore)


    ngOnInit(): void {

    }
    monthSelected(month) {
        this.selectedMonthNumber = new Date(month.date).getMonth()
    }

}
