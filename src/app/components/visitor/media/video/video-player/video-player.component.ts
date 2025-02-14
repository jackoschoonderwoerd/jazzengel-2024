import { Component, inject, OnInit, signal, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, Router } from '@angular/router';
import { SafePipe } from '../../../../../pipes/safe.pipe';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { VideoService } from '../video.service';
import { JazzengelVideo } from '../../../../../models/jazzengel-video';
import { JsonPipe } from '@angular/common';

@Component({
    selector: 'app-video-player',
    imports: [MatButtonModule, SafePipe, MatIconModule],
    templateUrl: './video-player.component.html',
    styleUrl: './video-player.component.scss'
})
export class VideoPlayerComponent implements OnInit {

    route = inject(ActivatedRoute)
    router = inject(Router)
    downloadUrl = signal<string>('');
    isLoading = true;
    @ViewChild('iframe') public iframe: HTMLIFrameElement
    videoService = inject(VideoService)
    video: JazzengelVideo


    ngOnInit(): void {
        this.video = this.videoService.getVideoSelected();
        console.log(this.video)


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
