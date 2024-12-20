import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FirestoreService } from '../../../../../services/firestore.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Artist } from '../../../../../models/artist.model';
import { MatButtonModule } from '@angular/material/button';
import { ImageData } from '../../../../../models/image-data';
import { StorageService } from '../../../../../services/storage.service';
import { FirebaseError } from '@angular/fire/app';
import { CapitalizeNamePipe } from '../../../../../pipes/capitalize-name.pipe';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../shared/confirm-dialog/confirm-dialog.component';

@Component({
    selector: 'app-artist-image',
    imports: [MatButtonModule, CapitalizeNamePipe],
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
    imageFile: File;
    artist: Artist;
    imageChanged: boolean = false;
    dialog = inject(MatDialog);
    imageFileSize: number = null




    ngOnInit(): void {
        this.route.params.subscribe((params: any) => {
            if (params.imageUrl) {
                this.imageUrl = params.imageUrl
            }
            if (params.id) {
                this.id = params.id;
                const pathToArtist = `artists/${this.id}`
                this.fs.getDoc(pathToArtist).subscribe((artist: Artist) => {
                    this.artist = artist
                })
            }
        })
    }

    onFileInputChange(e: any) {
        this.imageChanged = true
        this.imageFile = e.target.files[0];
        this.imageFileSize = this.imageFile.size;
        if (this.imageFile.size > 80000) {
            alert('Please resize')
        }



        let reader = new FileReader();
        reader.addEventListener('load', (ev: any) => {
            this.image = ev.target['result'];

            this.sourceIsFile = true;

        });
        reader.readAsDataURL(e.target.files[0]);

    }
    onCancel() {
        if (this.imageChanged) {
            const dialogRef = this.dialog.open(ConfirmDialogComponent, {
                data: {
                    message: 'Your changes heve not been saved'
                }
            })
            dialogRef.afterClosed().subscribe((res: boolean) => {
                if (res) {
                    this.router.navigate(['admin/artist', { id: this.id }]);
                }
            })

        } else {
            this.router.navigate(['admin/artist', { id: this.id }]);
        }
    }



    onSave() {

        const fileName = this.imageFile.name;
        const filePath = `artists/${this.artist.id}/images/${fileName}`
        const dbPathToArtist = `artists/${this.artist.id}`
        this.deleteOriginalImageFile(filePath)
            .then((res: any) => {
                console.log(`original file deleted ${res}`)
            })
            .catch((err: FirebaseError) => {
                console.error(`failed to delete original file ${err.message}`)
            })
            .then(() => {
                this.storeImageFile(filePath)
                    .then((downloadUrl: string) => {
                        console.log(downloadUrl)
                        const imageUrl = downloadUrl
                        return this.updateImageUrl(dbPathToArtist, imageUrl)
                    })
                    .catch((err: FirebaseError) => {
                        console.log(`failed to update imageUrl; ${err.message}`)
                    })
                    .then((res: any) => {
                        console.log(`imageUrl updated ${res}`)
                        return this.updateFilePath(dbPathToArtist, filePath)
                    })
                    .then((res: any) => {
                        console.log(`filepath updated; ${res}`)
                        this.router.navigate(['admin/artist', { id: this.id }])
                    })
                    .catch((err: FirebaseError) => {
                        console.log(`failed to update filePath; ${err.message}`)
                    })

            })
    }

    onDelete() {
        const filePath = this.artist.filePath
        this.deleteImageFile(filePath)
            .then((res: any) => {
                const dbPathToArtist = `artists/${this.artist.id}`
                const imageUrl = null;
                this.updateImageUrl(dbPathToArtist, imageUrl);
                this.image = null;
                this.router.navigate(['admin/artist', { id: this.id }])
            })
            .catch((err: FirebaseError) => {
                console.log(`failed to delete image`)
            })
    }
    private async deleteImageFile(filePath: string) {
        return await this.storage.deleteObject(filePath)
    }

    private storeImageFile(path: string) {
        console.log(path, this.imageFile)
        // return;
        return this.storage.storeFile(path, this.imageFile);
    }

    private deleteOriginalImageFile(path) {
        return this.storage.checkForExistingFilename(path)
            .then((res: any) => {
                console.log(`file found; ${res}`)
                return this.storage.deleteObject(path)
            })
            .catch((err: FirebaseError) => {
                console.error(`file not found; ${err.message}`)
            })
    }

    private updateImageUrl(path: string, imageUrl: string) {
        return this.fs.updateDoc(path, { imageUrl })
    }

    private updateFilePath(dbPathToArtist, filePath: string) {

        return this.fs.updateDoc(dbPathToArtist, { filePath })

    }
}
