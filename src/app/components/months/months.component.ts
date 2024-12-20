import { Component, inject, OnInit } from '@angular/core';
import { AdminStore } from '../admin//admin.store';
import { MatDialog } from '@angular/material/dialog';
import { FirestoreService } from '../../services/firestore.service';
import { MatButtonModule } from '@angular/material/button';
import { CalendarService } from '../../services/calendar.service';
import { MatExpansionModule } from '@angular/material/expansion';
import { MonthPipe } from '../../pipes/month.pipe';
import { DateComponent } from './date/date.component';
import { AuthStore } from '../../auth/auth.store';



@Component({
    selector: 'app-concerts',
    standalone: true,
    imports: [
        MatButtonModule,
        MatExpansionModule,
        MonthPipe,
        DateComponent,
    ],
    templateUrl: './months.component.html',
    styleUrl: './months.component.scss'
})
export class MonthsComponent {
    adminStore = inject(AdminStore);
    dialog = inject(MatDialog);
    fs = inject(FirestoreService)
    calendarService = inject(CalendarService)
    dates: any
    isExpanded: boolean = false;
    selectedMonthNumber: number = new Date().getMonth();
    authStore = inject(AuthStore)



    monthSelected(month) {
        this.selectedMonthNumber = new Date(month.date).getMonth()
    }

}
