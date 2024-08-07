import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from "@angular/router";

import { inject } from "@angular/core";
import { AuthStore } from "../auth/auth.store";
import { MatDialog } from "@angular/material/dialog";
import { WarnDialogComponent } from "../components/admin/shared/warn-dialog/warn-dialog.component";



export const isUserAuhtenticated: CanActivateFn =
    (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
        const authStore = inject(AuthStore);
        const router = inject(Router)
        const dialog = inject(MatDialog)
        if (authStore.isLoggedIn()) {
            return true
        } else {
            return true;
            dialog.open(WarnDialogComponent, {
                data: {
                    message: `No access, admin only`,
                },
                width: '250px'
            })
            return router.parseUrl('/login');
        }
    }
