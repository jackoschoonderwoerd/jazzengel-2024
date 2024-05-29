import { Routes } from '@angular/router';

export const STATS_ROUTES: Routes = [
    {
        path: 'musicians-appearance',
        loadComponent: () => import('./musicians-appearance/musicians-appearance.component')
            .then(c => c.MusiciansAppearanceComponent)
    }
];
