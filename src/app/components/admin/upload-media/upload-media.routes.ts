import { Routes } from '@angular/router';

export const UPLOAD_MEDIA_ROUTES: Routes = [
    {
        path: 'jazzengel-video',
        loadComponent: () => import('./video/video.component')
            .then(c => c.VideoComponent)

    },

    // {
    //     path: 'program',
    //     loadComponent: () => import('./components/months/months.component')
    //         .then(c => c.MonthsComponent)
    // },
    // {
    //     path: 'media',
    //     loadComponent: () => import('./components/visitor/media/media.component')
    //         .then(c => c.MediaComponent)
    // },
    // {
    //     path: 'media-player',
    //     loadComponent: () => import('./components/visitor/media/media-player/media-player.component')
    //         .then(c => c.MediaPlayerComponent)
    // },
    // {
    //     path: 'about',
    //     loadComponent: () => import('./components/visitor/about/about.component')
    //         .then(c => c.AboutComponent)
    // },

    // {
    //     path: '**', redirectTo: 'program'
    // }
];
