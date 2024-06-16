// https://zoaibkhan.com/blog/how-to-build-an-image-cropper-control-in-angular/
import { Component, computed, Input, signal } from '@angular/core';

@Component({
    selector: 'app-artist-image-zoaib',
    standalone: true,
    imports: [],
    templateUrl: './artist-image-zoaib.component.html',
    styleUrl: './artist-image-zoaib.component.scss'
})
export class ArtistImageZoaibComponent {
    imageWidth = signal(0);
    @Input() set width(val: number) {
        this.imageWidth.set(val);
    }

    imageHeight = signal(0);
    @Input() set height(val: number) {
        this.imageHeight.set(val);
    }

    placeholder = computed(() => `https://placehold.co/${this.imageWidth()}x${this.imageHeight()}`);
}
