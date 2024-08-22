import { Routes } from '@angular/router';
import { isUserAuhtenticated } from './guards/auth.guard';


export const routes: Routes = [
    {
        path: 'admin',
        loadComponent: () => import('./components/admin/admin.component')
            .then(c => c.AdminComponent),
        canActivate: [isUserAuhtenticated],
        loadChildren: () => import('./components/admin/admin.routes')
            .then(r => r.ADMIN_ROUTES),
        canActivateChild: [isUserAuhtenticated]
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
        path: 'media',
        loadComponent: () => import('./components/visitor/media/media.component')
            .then(c => c.MediaComponent)
    },
    {
        path: 'media-player',
        loadComponent: () => import('./components/visitor/media/video/video-player/video-player.component')
            .then(c => c.VideoPlayerComponent)
    },
    {
        path: 'about',
        loadComponent: () => import('./components/visitor/about/about.component')
            .then(c => c.AboutComponent)
    },
    {
        path: 'location',
        loadComponent: () => import('./components/visitor/location/location.component')
            .then(c => c.LocationComponent)
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
