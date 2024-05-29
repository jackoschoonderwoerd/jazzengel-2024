import { Component, EventEmitter, inject, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AuthStore } from '../../auth/auth.store';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { LoginComponent } from '../../auth/login/login.component';
import { UserLogin } from '../../models/user-login.model';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';

@Component({
    selector: 'app-toolbar',
    standalone: true,
    imports: [
        MatToolbarModule,
        MatIconModule,
        MatButtonModule,
        MatDialogModule
    ],
    templateUrl: './toolbar.component.html',
    styleUrl: './toolbar.component.scss'
})
export class ToolbarComponent {
    authStore = inject(AuthStore)
    dialog = inject(MatDialog)
    router = inject(Router)

    @Output() sidenavToggle = new EventEmitter<void>

    onLogin() {
        const dialogRef = this.dialog.open(LoginComponent)
        dialogRef.afterClosed().subscribe((loginData: UserLogin) => {
            this.authStore.login(loginData).then((res: any) => {
                this.router.navigateByUrl('admin')

            })
        })
    }

    onMenu() {
        console.log(' menu')
        this.sidenavToggle.emit()
    }

    onLogout() {
        this.authStore.logout().then((res: any) => {
            this.router.navigateByUrl('program')
        });
    }
}
