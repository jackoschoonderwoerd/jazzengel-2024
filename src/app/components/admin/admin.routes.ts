import { Routes } from '@angular/router';
import { VisitsComponent } from './shared/visits/visits.component';

export const ADMIN_ROUTES: Routes = [
    {
        path: 'stats',
        loadComponent: () => import('./stats/stats.component')
            .then(c => c.StatsComponent),
        loadChildren: () => import('./stats/stats.routes')
            .then(r => r.STATS_ROUTES)
    },
    {
        path: 'store',
        loadComponent: () => import('./store/store.component')
            .then(c => c.StoreComponent)
    },
    {
        path: 'artists',
        loadComponent: () => import('./artists/artists.component')
            .then(c => c.ArtistsComponent)
    },
    {
        path: 'artist',
        loadComponent: () => import('./artists/artist/artist.component')
            .then(c => c.ArtistComponent)
    },
    {
        path: 'artist-image',
        loadComponent: () => import('./artists/artist/artist-image/artist-image.component')
            .then(c => c.ArtistImageComponent)
    },
    {
        path: 'artist-bio',
        loadComponent: () => import('./artists/artist/artist-bio/artist-bio.component')
            .then(c => c.ArtistBioComponent)
    },
    {
        path: 'artist-info',
        loadComponent: () => import('./artists/artist/artist-info/artist-info.component')
            .then(c => c.ArtistInfoComponent)
    },
    {
        path: 'upload-media',
        loadComponent: () => import('./upload-media/upload-media.component')
            .then(c => c.UploadMediaComponent),
        loadChildren: () => import('./upload-media/upload-media.routes')
            .then(r => r.UPLOAD_MEDIA_ROUTES)
    },
    {
        path: 'visits',
        loadComponent: () => import('./shared/visits/visits.component')
            .then(c => c.VisitsComponent)
    }


    // {
    //     path: 'artists-2024',
    //     loadComponent: () => import('./artists-2024/artists-2024.component')
    //         .then(c => c.Artists2024Component)
    // },
    // {
    //     path: 'concerts',
    //     loadComponent: () => import('./')
    //         .then(c => c.MonthsComponent)
    // }

];
