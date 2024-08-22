import { EventEmitter, Injectable } from '@angular/core';
import { JazzengelVideo } from '../../../../models/jazzengel-video';

@Injectable({
    providedIn: 'root'
})
export class VideoService {

    video: JazzengelVideo

    constructor() { }

    setVideoSelected(video: JazzengelVideo) {
        this.video = video
    }
    getVideoSelected() {
        return this.video
    }

}
