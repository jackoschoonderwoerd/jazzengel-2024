import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'admin',
        loadComponent: () => import('./components/admin/admin.component')
            .then(c => c.AdminComponent),
        loadChildren: () => import('./components/admin/admin.routes')
            .then(r => r.ADMIN_ROUTES)
    },
    // {
    //     path: 'program',
    //     loadComponent: () => import('./components/visitor/program/program.component')
    //         .then(c => c.ProgramComponent)
    // },
    {
        path: 'program',
        loadComponent: () => import('./components/months/months.component')
            .then(c => c.MonthsComponent)
    },
    {
        path: 'about',
        loadComponent: () => import('./components/visitor/about/about.component')
            .then(c => c.AboutComponent)
    },
    // {
    //     path: 'artists',
    //     loadComponent: () => import('./components/admin/artists/artists.component')
    //         .then(c => c.ArtistsComponent)
    // },
    // {
    //     path: 'stats',
    //     loadComponent: () => import('./components/admin/stats/stats.component')
    //         .then(c => c.StatsComponent)
    // },
    // {
    //     path: 'artist-2024',
    //     loadComponent: () => import('./components/admin/artists-2024/artist-2024/artist-2024.component')
    //         .then(c => c.FormViewComponent)
    // },
    {
        path: '**', redirectTo: 'program'
    }
];
