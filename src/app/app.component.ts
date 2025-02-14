// https://github.com/angular/components/issues/8287
// https://javascript.plainenglish.io/javascript-create-file-c36f8bccb3be
// Excel: https://www.youtube.com/watch?v=j2gQArYvgw0

import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';


import { AuthStore } from './auth/auth.store';
import { ToolbarComponent } from './navigation/toolbar/toolbar.component';
import { AdminStore } from './components/admin/admin.store';
import { User as FirebaseUser } from "@angular/fire/auth";
import { Auth, onAuthStateChanged } from '@angular/fire/auth';
import { MatSidenavModule } from '@angular/material/sidenav';

import { SidenavComponent } from './navigation/sidenav/sidenav.component';

import { MatDialog } from '@angular/material/dialog';

import { VisitorService } from './components/visitor/visitor.service';
import { LoadingIndicatorComponent } from './loading-indicator/loading-indicator.component';
import { CalendarService } from './services/calendar.service';
import { SwUpdate } from '@angular/service-worker';

@Component({
    selector: 'app-root',
    imports: [
        RouterOutlet,
        ToolbarComponent,
        LoadingIndicatorComponent,
        SidenavComponent,
        MatSidenavModule,
        SidenavComponent,
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
    swUpdate = inject(SwUpdate);

    ngOnInit(): void {

        this.adminStore.loadArtists();
        this.visitorService.getArtists();
        onAuthStateChanged(this.afAuth, (user: FirebaseUser | null) => {
            console.log(`onAuthStateChanged()`)
            // const today: Date = new Date(new Date().setHours(0, 0, 0, 0))
            if (user) {
                this.calendarService.getCalendar(0, 10)
                this.auStore.persistLogin(user);


            } else {
                this.calendarService.getCalendar(0, 10)
                // this.dialog.open(ThisSundayComponent)
                // let maxDate = new Date(today.getFullYear(), today.getMonth() + 3, today.getDay())
                // maxDate = new Date(maxDate.setHours(0, 0, 0, 0))

                // this.calendarService.getCalendar(today, maxDate)
                console.log('no user')
                // this.adminStore.setVisibleWeeksAhead(12)
            }
        });
        // if (this.swUpdate.isEnabled) {
        //     this.swUpdate.versionUpdates.subscribe(() => {
        //         if (confirm('New version available. Load new version?')) {
        //             window.location.reload();
        //         }
        //     });
        // }
    }
}
