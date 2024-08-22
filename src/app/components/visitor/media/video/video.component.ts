import { Component, EventEmitter, inject, OnInit, Output, SecurityContext, signal } from '@angular/core';
import { FirestoreService } from '../../../../services/firestore.service';
import { JazzengelVideo } from '../../../../models/jazzengel-video';
import { DatePipe, JsonPipe } from '@angular/common';
import { SafePipe } from '../../../../pipes/safe.pipe';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { MatExpansionModule } from '@angular/material/expansion';
import { CapitalizeNamePipe } from '../../../../pipes/capitalize-name.pipe';
import { take } from 'rxjs';
import { VideoService } from './video.service';

interface VideoArtist {
    name: string;
    instrument: string;
    videoIds: string[];

}

@Component({
    selector: 'app-video',
    standalone: true,
    imports: [
        JsonPipe,
        DatePipe,
        SafePipe,
        MatIconModule,
        MatButtonModule,
        MatExpansionModule,
        CapitalizeNamePipe
    ],
    templateUrl: './video.component.html',
    styleUrl: './video.component.scss'
})



export class VideoComponent implements OnInit {

    fs = inject(FirestoreService)


    ngOnInit(): void {
        this.loadMedia();

    }

    videos = signal<JazzengelVideo[]>([])
    url: any;
    router = inject(Router)
    sortedVideoArtists = signal<VideoArtist[]>([])
    activeVideos = signal<JazzengelVideo[]>([])
    videoService = inject(VideoService)


    loadMedia() {
        const path = `videos`
        this.fs.collection(path).pipe(take(1)).subscribe((videos: JazzengelVideo[]) => {
            // console.log(videos)
            this.videos.set(videos)
            this.url = videos[0].downloadUrl;
            this.getVideoArtists();
        })
    }
    onPlayMedia(video: JazzengelVideo) {
        console.log(video)
        this.videoService.setVideoSelected(video)
        this.router.navigate(['media-player', { downloadUrl: video.downloadUrl }])
    }

    private getVideoArtists() {
        const videoArtists = signal<any[]>([])
        this.videos().forEach((video: JazzengelVideo) => {
            video.artists.forEach((artist: any) => {
                const videoArtist: VideoArtist = {
                    name: artist.name,
                    instrument: artist.instrument,
                    videoIds: [video.id]
                }
                videoArtists().push(videoArtist)
            })
        })
        this.checkForDoubles(videoArtists())
    }
    private checkForDoubles(videoArtists: VideoArtist[]) {

        videoArtists.forEach((videoArtist: VideoArtist) => {
            const index = this.sortedVideoArtists().findIndex((sortedVideoArtist: VideoArtist) => {
                return videoArtist.name === sortedVideoArtist.name
            });
            if (index === -1) {
                this.sortedVideoArtists().push(videoArtist)
            } else {
                this.sortedVideoArtists()[index].videoIds.push(videoArtist.videoIds[0])
                this.sortedVideoArtists().sort((a: VideoArtist, b: VideoArtist) => a.name.localeCompare(b.name))
            }
        })
        // console.log(this.sortedVideoArtists())

    }

    onArtist(videoIds: string[]) {
        // console.log(videoIds)
        this.activeVideos().length = 0
        videoIds.forEach((videoId: string) => {
            this.fs.getDoc(`videos/${videoId}`).subscribe((video: JazzengelVideo) => {
                this.activeVideos().push(video)
            })
        })
    }

    getVideo(videoId) {
        return this.fs.getDoc(`videos/${videoId}`)
    }

}

