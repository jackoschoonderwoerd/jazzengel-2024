import { Routes } from '@angular/router';

export const ADMIN_ROUTES: Routes = [
    {
        path: 'stats',
        loadComponent: () => import('./stats/stats.component')
            .then(c => c.StatsComponent),
        loadChildren: () => import('./stats/stats.routes')
            .then(r => r.STATS_ROUTES)
    },
    {
        path: 'artists',
        loadComponent: () => import('./artists/artists.component')
            .then(c => c.ArtistsComponent)
    },
    // {
    //     path: 'concerts',
    //     loadComponent: () => import('./')
    //         .then(c => c.MonthsComponent)
    // }

];
