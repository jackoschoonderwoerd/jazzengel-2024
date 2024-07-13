import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FirestoreService } from './services/firestore.service';
import { DocumentReference } from '@angular/fire/firestore';
import { FirebaseError } from '@angular/fire/app';

import { AuthStore } from './auth/auth.store';
import { ToolbarComponent } from './navigation/toolbar/toolbar.component';
import { AdminStore } from './components/admin/admin.store';
import { User as FirebaseUser } from "@angular/fire/auth";
import { Auth, onAuthStateChanged } from '@angular/fire/auth';
import { MatSidenavModule } from '@angular/material/sidenav';

import { SidenavComponent } from './navigation/sidenav/sidenav.component';
import { FooterComponent } from './navigation/footer/footer.component';
import { MatDialog } from '@angular/material/dialog';
import { ThisSundayComponent } from './this-sunday/this-sunday.component';
import { VisitorService } from './components/visitor/visitor.service';
import { LoadingIndicatorComponent } from './loading-indicator/loading-indicator.component';
import { CalendarService } from './services/calendar.service';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [
        RouterOutlet,
        ToolbarComponent,
        LoadingIndicatorComponent,
        SidenavComponent,
        MatSidenavModule,
        SidenavComponent,
        FooterComponent
    ],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
    auStore = inject(AuthStore)
    adminStore = inject(AdminStore)
    title = 'jazzengel-2024';
    afAuth = inject(Auth);
    dialog = inject(MatDialog);
    visitorService = inject(VisitorService)
    calendarService = inject(CalendarService)

    ngOnInit(): void {
        // this.adminStore.loadConcerts();
        // console.log(this.adminStore.artists());
        this.adminStore.loadArtists();
        this.visitorService.getArtists();
        onAuthStateChanged(this.afAuth, (user: FirebaseUser | null) => {
            console.log(`onAuthStateChanged()`)
            // const today = new Date('4/1/2024')
            // console.log(today)
            const today: Date = new Date(new Date().setHours(0, 0, 0, 0))
            if (user) {
                this.calendarService.getCalendar(0, 10)
                let maxDate = new Date(today.getFullYear(), today.getMonth() + 10, today.getDay())
                maxDate = new Date(maxDate.setHours(0, 0, 0, 0))

                // this.calendarService.getCalendar(today, maxDate)
                this.auStore.persistLogin(user);
                // this.adminStore.setVisibleWeeksAhead(50)

            } else {
                this.calendarService.getCalendar(0, 3)
                this.dialog.open(ThisSundayComponent)
                let maxDate = new Date(today.getFullYear(), today.getMonth() + 3, today.getDay())
                maxDate = new Date(maxDate.setHours(0, 0, 0, 0))

                // this.calendarService.getCalendar(today, maxDate)
                console.log('no user')
                // this.adminStore.setVisibleWeeksAhead(12)
            }
        })
    }
}
