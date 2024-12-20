import { Component, inject, OnInit, signal } from '@angular/core';
import { StorageService } from '../../../../services/storage.service';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FirestoreService } from '../../../../services/firestore.service';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { DatePipe, JsonPipe, NgFor } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { SafePipe } from '../../../../pipes/safe.pipe';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ArtistForMedia } from '../../../../models/artist-for-media';
import { JazzengelPhoto } from '../../../../models/jazzengel-photo';
import { DocumentReference } from '@angular/fire/firestore';
import { FirebaseError } from '@angular/fire/app';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';
import { LargePhotoDialogComponent } from './large-photo-dialog/large-photo-dialog.component';

@Component({
    selector: 'app-upload-photo',
    imports: [
        MatButtonModule,
        ReactiveFormsModule,
        MatInputModule,
        MatLabel,
        MatFormFieldModule,
        NgFor,
        MatIconModule,
        SafePipe,
        DatePipe,
        JsonPipe,
        MatDatepickerModule,
        MatIconModule
    ],
    templateUrl: './upload-photo.component.html',
    styleUrl: './upload-photo.component.scss'
})
export class UploadPhotoComponent implements OnInit {

    storage = inject(StorageService)
    fb = inject(FormBuilder)
    fs = inject(FirestoreService)
    form: FormGroup;
    file: File;
    fileLocation: string;
    downloadUrl: string;
    formDisabled: boolean = false;
    editmode: boolean = false;
    photoUnderConstruction = signal<JazzengelPhoto>(null);
    router = inject(Router);
    jazzengelPhotos = signal<JazzengelPhoto[]>(null);
    url: any;
    dialog = inject(MatDialog)



    ngOnInit(): void {
        this.initForm();
        const path = 'photos'
        this.fs.collection(path).subscribe((jazzengelPhotos: JazzengelPhoto[]) => {
            this.jazzengelPhotos.set(jazzengelPhotos)
        })
    }
    initForm() {
        this.form = this.fb.group({
            date: new FormControl,
            artists: this.fb.array([])
        })
    }
    onFileInputChange(e: any) {
        if (e.target.files) {
            this.file = e.target.files[0]
            var reader = new FileReader()
            reader.readAsDataURL(this.file)
            reader.onload = (event: any) => {
                this.url = event.target.result
            }
        }
    }

    artists(): FormArray {
        return this.form.get('artists') as FormArray;
    }
    addArtist() {
        this.artists().push(this.newArtist());
    }
    newArtist(): FormGroup {
        return this.fb.group({
            name: '',
            instrument: '',
        });
    }

    onThumbnailSelected(downloadUrl: string) {
        this.dialog.open(LargePhotoDialogComponent, {
            data: {
                downloadUrl: downloadUrl
            }
        })
    }

    onEditJazzengelPhoto(photo: JazzengelPhoto) {
        this.clearAll();
        this.photoUnderConstruction.set(photo);
        this.editmode = true;
        this.url = photo.downloadUrl;
        this.patchArtists(photo.artists);

        this.form.patchValue({
            date: new Date(photo.date['seconds'] * 1000)
        })

    }

    patchArtists(artists: ArtistForMedia[]) {
        let control = <FormArray>this.form.controls['artists']
        artists.forEach((artist: ArtistForMedia) => {
            control.push(this.fb.group(artist))
        })
    }

    onAddOrUpdatePhoto() {
        const formValue = this.form.value;
        console.log(formValue)
        if (!this.editmode || this.file) {
            const pathToFileLocation = `media/jazzengel-photos/${this.file.name}`
            this.storage.storeFile(pathToFileLocation, this.file)
                .then((downloadUrl: string) => {
                    const jazzengelPhoto: JazzengelPhoto = {
                        downloadUrl: downloadUrl,
                        date: formValue.date,
                        artists: formValue.artists,
                        fileLocation: pathToFileLocation
                    }
                    console.log(jazzengelPhoto)
                    const path = 'photos'
                    this.storePhotoData(path, jazzengelPhoto)
                        .then((docRef: DocumentReference) => {
                            console.log(`document added; ${docRef.id}`)
                        })
                        .catch((err: FirebaseError) => {
                            console.log(`failed to add document: ${err.message}`)
                        });
                })
                .catch((err: FirebaseError) => {
                    console.log(`failed to store file; ${err.message}`)
                });

        } else {
            const jazzengelPhoto: JazzengelPhoto = {
                id: this.photoUnderConstruction().id,
                downloadUrl: this.photoUnderConstruction().downloadUrl,
                date: formValue.date,
                artists: formValue.artists,
                fileLocation: this.photoUnderConstruction().fileLocation
            }
            const path = `photos/${this.photoUnderConstruction().id}`
            this.fs.setDoc(path, jazzengelPhoto)
                .then((res: any) => {
                    console.log(`jazzengelPhoto updated: ${res}`)
                })
                .catch((err: FirebaseError) => {
                    console.log(`failed to update jazzengelPhoto; ${err.message}`)
                })
        }
    }

    onDeleteJazengelPhoto(jazzengelPhoto: JazzengelPhoto) {
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            data: {
                message: 'This will permanently delete the photo and all of it\'s properties'
            }
        })
        dialogRef.afterClosed().subscribe((res: boolean) => {
            if (res) {
                this.storage.deleteObject(jazzengelPhoto.fileLocation)
                    .then((res: any) => {
                        console.log(`file deleted; ${res}`)
                        const path = `photos/${jazzengelPhoto.id}`
                        this.fs.deleteDoc(path)
                            .then((res: any) => {
                                console.log(`document deleted; ${res}`)
                            })
                            .catch((err: FirebaseError) => {
                                console.log(`failed to delete document; ${err.message}`)
                            })
                    })
                    .catch((err: FirebaseError) => {
                        console.log(`failed to delete file: ${err.message}`)
                    })
            }
            return;
        })
    }

    storePhotoData(path: string, photofileProperties: JazzengelPhoto) {
        return this.fs.addDoc(path, photofileProperties)
    }

    storePhotoFile() {
        const path = `media/jazzengel-photos/${this.file.name}`
        return this.storage.storeFile(path, this.file)
    }

    clearAll() {
        this.form.reset();
        this.clearArtistsFormArray();
        this.downloadUrl = null;
        this.photoUnderConstruction.set(null);
        this.file = null;
        this.editmode = false;
    }

    private clearArtistsFormArray() {
        while (this.artists().length !== 0) {
            this.artists().removeAt(0)
        }
    }
    // updateJazzengelPhoto(path:string, jazzengelPhoto: JazzengelPhoto) {
    //     const path = `videos/${this.photoUnderConstruction().id}`
    //     console.log(path)
    //     // return;
    //     return this.fs.updateDoc(path, jazzengelPhoto)
    // }

    onCancel() {
        this.router.navigateByUrl('/admin/upload-media')
    }
}
