import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AuthStore } from '../../auth/auth.store';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { LoginComponent } from '../../auth/login/login.component';
import { UserLogin } from '../../models/user-login.model';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterModule } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { AdminStore } from '../../components/admin/admin.store';

@Component({
    selector: 'app-toolbar',
    standalone: true,
    imports: [
        MatToolbarModule,
        MatIconModule,
        MatButtonModule,
        MatDialogModule,
        MatListModule,
        MatIconModule,
        RouterModule
    ],
    templateUrl: './toolbar.component.html',
    styleUrl: './toolbar.component.scss'
})
export class ToolbarComponent implements OnInit {
    authStore = inject(AuthStore);
    dialog = inject(MatDialog);
    router = inject(Router);
    adminStore = inject(AdminStore)
    time: string

    @Output() sidenavToggle = new EventEmitter<void>


    ngOnInit(): void {
        this.time = `${new Date().getHours()}:${new Date().getMinutes()}`
    }

    onMenu() {
        console.log(' menu')
        this.sidenavToggle.emit()
    }
    onLogin() {
        const dialogRef = this.dialog.open(LoginComponent)
        dialogRef.afterClosed().subscribe((loginData: UserLogin) => {
            this.authStore.login(loginData).then((res: any) => {
                this.router.navigateByUrl('program')

            })
        })
    }
    onLogout() {
        console.log('logging out')
        this.authStore.logout();
    }


}
