import { Component } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { VideoComponent } from "../../visitor/media/video/video.component";

@Component({
    selector: 'app-media',
    standalone: true,
    imports: [MatTabsModule, VideoComponent],
    templateUrl: './media.component.html',
    styleUrl: './media.component.scss'
})
export class MediaComponent {

}
