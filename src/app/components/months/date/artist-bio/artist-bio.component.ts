import { Component, inject, Input, ViewEncapsulation } from '@angular/core';
import { Artist } from '../../../../models/artist.model';
import { MatExpansionModule } from '@angular/material/expansion';
import { JsonPipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CapitalizeNamePipe } from '../../../../pipes/capitalize-name.pipe';
import { MatTabsModule } from '@angular/material/tabs';
import { AdminStore } from '../../../admin/admin.store';

@Component({
    selector: 'app-artist-bio',
    standalone: true,
    imports: [
        MatExpansionModule,
        JsonPipe,
        MatCardModule,
        MatButtonModule,
        MatTabsModule,
        MatIconModule,
        CapitalizeNamePipe
    ],
    templateUrl: './artist-bio.component.html',
    styleUrl: './artist-bio.component.scss',
    // encapsulation: ViewEncapsulation.None
    // encapsulation: ViewEncapsulation.None
})
export class ArtistBioComponent {
    @Input() public artist!: Artist;
    isExpanded: boolean = false;
    adminStore = inject(AdminStore)

    onClose() {
        this.isExpanded = false
    }
    onArtistSelected(event) {
        this.adminStore.setSelectedArtistId(this.artist.id)
    }
}
