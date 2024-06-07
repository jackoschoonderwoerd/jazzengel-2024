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

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [
        RouterOutlet,
        ToolbarComponent,

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
    dialog = inject(MatDialog)

    ngOnInit(): void {
        this.adminStore.loadConcerts();
        onAuthStateChanged(this.afAuth, (user: FirebaseUser | null) => {
            if (user) {
                this.auStore.persistLogin();

            } else {
                console.log(' no user')
            }
        })


    }


}
