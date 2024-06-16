import { Component, inject, OnInit, SecurityContext, signal } from '@angular/core';
import { FirestoreService } from '../../../services/firestore.service';
import { JazzengelVideo } from '../../../models/jazzengel-video';
import { DatePipe, JsonPipe } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { SafePipe } from '../../../pipes/safe.pipe';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { MatExpansionModule } from '@angular/material/expansion';
import { CapitalizeNamePipe } from '../../../pipes/capitalize-name.pipe';

@Component({
    selector: 'app-media',
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
    templateUrl: './media.component.html',
    styleUrl: './media.component.scss'
})
export class MediaComponent implements OnInit {

    fs = inject(FirestoreService)


    ngOnInit(): void {
        this.loadMedia()
    }

    videos = signal<JazzengelVideo[]>([])
    url: any;
    router = inject(Router)

    loadMedia() {
        const path = `videos`
        this.fs.asyncCollection(path).then((videos: JazzengelVideo[]) => {
            console.log(videos)
            this.videos.set(videos)
            this.url = videos[0].downloadUrl;
            // url = this.domSanitizer.sanitize(SecurityContext.URL, url.toString());
            // this.url = this.domSanitizer.bypassSecurityTrustResourceUrl(url);
            // console.log(this.url)
            // this.domSanitizer.bypassSecurityTrustResourceUrl(this.domSanitizer.sanitize(SecurityContext.URL, url.toString()))

        })
    }
    onPlayMedia(downloadUrl: string) {
        this.router.navigate(['media-player', { downloadUrl }])
    }
}
