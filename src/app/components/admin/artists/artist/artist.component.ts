import { Component, inject, OnInit } from '@angular/core';
import { ArtistBioComponent } from './artist-bio/artist-bio.component';
import { ArtistImageComponent } from './artist-image/artist-image.component';
import { ArtistInfoComponent } from './artist-info/artist-info.component';
import { ActivatedRoute, Router } from '@angular/router';
import { FirestoreService } from '../../../../services/firestore.service';
import { CapitalizeNamePipe } from '../../../../pipes/capitalize-name.pipe';
import { MatButtonModule } from '@angular/material/button';
import { StorageService } from '../../../../services/storage.service';
import { Artist } from '../../../../models/artist.model';
import { ImageData } from '../../../../models/image-data';
import { FirebaseError } from '@angular/fire/app';
import { MatIconModule } from '@angular/material/icon';



@Component({
    selector: 'app-artist',
    standalone: true,
    imports: [
        ArtistBioComponent,
        ArtistImageComponent,
        ArtistInfoComponent,
        CapitalizeNamePipe,
        MatButtonModule,
        MatIconModule

    ],
    templateUrl: './artist.component.html',
    styleUrl: './artist.component.scss'
})
export class ArtistComponent implements OnInit {
    route = inject(ActivatedRoute);
    router = inject(Router);
    fs = inject(FirestoreService)
    storage = inject(StorageService)
    id!: string;
    editmode: boolean = false;
    artist: Artist;



    ngOnInit(): void {
        this.route.params.subscribe((params: any) => {
            console.log(params)
            if (params.id) {
                console.log(params.id)
                this.editmode = true;
                this.id = params.id;
                const path = `artists/${params.id}`
                this.fs.getDoc(path).subscribe((artist: Artist) => {
                    this.artist = artist;
                })

            } else {
                this.artist = {
                    name: '',
                    instrument: '',
                    biography: '',
                    id: '',
                    filePath: '',
                    imageUrl: ''
                }
            }
        })
    }

    onEditImage() {
        this.router.navigate(['admin/artist-image', { imageUrl: this.artist.imageUrl, id: this.artist.id }])
    }



    onEditBiography() {
        console.log('edit bio')
        this.router.navigate(['admin/artist-bio', { id: this.artist.id }])
    }

    onEditArtistInfo() {
        if (this.editmode) {
            this.router.navigate(['admin/artist-info', { id: this.id }])
        } else {
            this.router.navigateByUrl('admin/artist-info')
        }
    }





    onCancel() {
        this.router.navigateByUrl('admin/artists')
    }

    private s

    onBackToArtists() {
        this.router.navigateByUrl('admin/artists')
    }
}

