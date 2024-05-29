import { Component, Input, ViewEncapsulation } from '@angular/core';
import { Artist } from '../../../../models/artist.model';
import { MatExpansionModule } from '@angular/material/expansion';
import { JsonPipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-artist-bio',
    standalone: true,
    imports: [
        MatExpansionModule,
        JsonPipe,
        MatCardModule,
        MatButtonModule,
        MatIconModule
    ],
    templateUrl: './artist-bio.component.html',
    styleUrl: './artist-bio.component.scss',
    // encapsulation: ViewEncapsulation.None
})
export class ArtistBioComponent {
    @Input() public artist!: Artist;
    isExpanded: boolean = false

    onClose() {
        this.isExpanded = false
    }
}
