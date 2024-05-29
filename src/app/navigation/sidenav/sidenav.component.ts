import { Component, EventEmitter, inject, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { Router, RouterModule } from '@angular/router';
import { LoginComponent } from '../../auth/login/login.component';
import { AuthStore } from '../../auth/auth.store';
import { UserLogin } from '../../models/user-login.model';

@Component({
    selector: 'app-sidenav',
    standalone: true,
    imports: [
        MatButtonModule,
        MatIconModule,
        MatListModule,
        RouterModule,
        MatIconModule
    ],
    templateUrl: './sidenav.component.html',
    styleUrl: './sidenav.component.scss'
})
export class SidenavComponent {
    @Output() closeSidenav = new EventEmitter<void>
    dialog = inject(MatDialog)
    authStore = inject(AuthStore);
    router = inject(Router)

    onCloseSidenav() {
        this.closeSidenav.emit()
    }
    onLogin() {
        const dialogRef = this.dialog.open(LoginComponent)
        dialogRef.afterClosed().subscribe((loginData: UserLogin) => {
            this.authStore.login(loginData).then((res: any) => {
                this.router.navigateByUrl('program')
                this.onCloseSidenav();
            })
        })
    }
    onLogout() {
        this.authStore.logout();
        this.onCloseSidenav()
    }
}
