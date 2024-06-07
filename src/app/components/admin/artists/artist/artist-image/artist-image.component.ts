import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FirestoreService } from '../../../../../services/firestore.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Artist } from '../../../../../models/artist.model';
import { MatButtonModule } from '@angular/material/button';
import { ImageData } from '../../../../../models/image-data';
import { StorageService } from '../../../../../services/storage.service';
import { FirebaseError } from '@angular/fire/app';

@Component({
    selector: 'app-artist-image',
    standalone: true,
    imports: [MatButtonModule],
    templateUrl: './artist-image.component.html',
    styleUrl: './artist-image.component.scss'
})
export class ArtistImageComponent implements OnInit {
    route = inject(ActivatedRoute);
    fs = inject(FirestoreService);
    storage = inject(StorageService)
    fb = inject(FormBuilder);
    router = inject(Router)
    imageUrl!: string;
    image: File;
    sourceIsFile: boolean = false;
    id: string;
    // filePath: string;
    imageFile: File




    ngOnInit(): void {
        this.route.params.subscribe((params: any) => {
            if (params.imageUrl) {
                this.imageUrl = params.imageUrl
            }
            if (params.id) {
                this.id = params.id
            }
            // if (params.filePath) {
            //     this.filePath = params.filepath
            // }
        })
    }
    onFileInputChange(e: any) {
        this.imageFile = e.target.files[0];
        this.deleteOriginalImage()
            .then((res: any) => {
                console.log(res)
            })
            .catch((err: FirebaseError) => {
                console.error(err.message)
            })
            .then((res: any) => {
                console.log(`file deleted; ${res}`)
            })
            .catch((err: FirebaseError) => {
                console.error(`failed to delete file; ${err.message}`)
            })
            .then(() => {
                console.log(this.imageFile.name)
                let reader = new FileReader();
                reader.addEventListener('load', (ev: any) => {
                    this.image = ev.target['result'];
                    this.sourceIsFile = true;
                    const path = `artists/${this.id}`
                    this.storeImageFile(path)
                        .then((imageUrl: string) => {
                            console.log(imageUrl)
                            const path = `artists/${this.id}`
                            return this.updateImageUrl(path, imageUrl)
                        })
                        .then((res: any) => {
                            console.log(`imageUrl updated`)
                        })
                        .catch((err: FirebaseError) => {
                            console.error(`failed to update imageUrl; ${err.message}`)
                        })
                });
                reader.readAsDataURL(e.target.files[0]);
            })

    }

    onDone() {
        this.router.navigate(['admin/artist', { id: this.id }])
    }

    private storeImageFile(path: string) {
        console.log(path, this.imageFile)
        // return;
        return this.storage.storeFile(path, this.imageFile);
    }

    private deleteOriginalImage() {

        const path = `artists/${this.id}`
        return this.storage.checkForExistingFilename(path)
            .then((res: any) => {
                console.log(`file found${res}`)
                return this.storage.deleteObject(path)
                // .then((res: any) => {
                //     console.log('file deleted')
                // })
                // .catch((err: FirebaseError) => {
                //     console.error(`failed to delete file; ${err.message}`)
                // })
            })
            .catch((err: FirebaseError) => {
                console.error(`file not found ${err.message}`)
            })
    }

    private updateImageUrl(path: string, imageUrl: string) {
        return this.fs.updateDoc(path, { imageUrl })
    }
}
