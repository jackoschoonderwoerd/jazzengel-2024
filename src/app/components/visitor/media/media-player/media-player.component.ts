import { Component, inject, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, Router } from '@angular/router';
import { SafePipe } from '../../../../pipes/safe.pipe';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

@Component({
    selector: 'app-media-player',
    standalone: true,
    imports: [MatButtonModule, SafePipe, MatIconModule, MatProgressSpinner],
    templateUrl: './media-player.component.html',
    styleUrl: './media-player.component.scss'
})
export class MediaPlayerComponent implements OnInit {

    route = inject(ActivatedRoute)
    router = inject(Router)
    downloadUrl = signal<string>('');
    isLoading = true;

    ngOnInit(): void {
        this.route.params.subscribe((params: any) => {
            console.log(params)
            console.log(params.downloadUrl)
            this.downloadUrl.set(params.downloadUrl)
        })
    }

    onMediaList() {
        this.router.navigateByUrl('/media')
    }
    stopLoading() {
        this.isLoading = false;
    }
}
