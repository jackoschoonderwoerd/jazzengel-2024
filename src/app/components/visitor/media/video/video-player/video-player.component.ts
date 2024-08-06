import { AfterViewInit, Component, ElementRef, inject, OnInit, signal, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, Router } from '@angular/router';
import { SafePipe } from '../../../../../pipes/safe.pipe';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

@Component({
    selector: 'app-video-player',
    standalone: true,
    imports: [MatButtonModule, SafePipe, MatIconModule, MatProgressSpinner],
    templateUrl: './video-player.component.html',
    styleUrl: './video-player.component.scss'
})
export class VideoPlayerComponent implements OnInit {

    route = inject(ActivatedRoute)
    router = inject(Router)
    downloadUrl = signal<string>('');
    isLoading = true;
    @ViewChild('iframe') public iframe: HTMLIFrameElement


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
    // Define the method to handle the iframe load event
    onIframeLoad(iframe: HTMLIFrameElement) {
        console.log('Iframe has loaded.');
    }
}
