import { Routes } from '@angular/router';

export const UPLOAD_MEDIA_ROUTES: Routes = [
    {
        path: 'upload-video',
        loadComponent: () => import('./upload-video/upload-video.component')
            .then(c => c.UploadVideoComponent)

    },
    {
        path: 'upload-photo',
        loadComponent: () => import('./upload-photo/upload-photo.component')
            .then(c => c.UploadPhotoComponent)
    }

];
