import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { StorageService } from '../../../../services/storage.service';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule, MatLabel } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FirestoreService } from '../../../../services/firestore.service';
import { FirebaseError } from '@angular/fire/app';
import { JazzengelVideo } from '../../../../models/jazzengel-video';
import { DatePipe, NgFor } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { SafePipe } from '../../../../pipes/safe.pipe';
import { ArtistForMedia } from '../../../../models/artist-for-media';
import { DocumentReference } from '@angular/fire/firestore';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { Router } from '@angular/router';

@Component({
    selector: 'app-video',
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
        MatDatepickerModule
    ],
    templateUrl: './upload-video.component.html',
    styleUrl: './upload-video.component.scss'
})
export class UploadVideoComponent {
    formDisabled = false;
    storage = inject(StorageService);
    fs = inject(FirestoreService)
    fb = inject(FormBuilder)
    router = inject(Router)
    form: FormGroup;
    file: File;
    downloadUrl: string = '';
    fileLocation: string;
    jazzengelVideos = signal<JazzengelVideo[]>(null)
    editmode: boolean = false;
    videoUnderConstruction = signal<JazzengelVideo>(null)

    ngOnInit(): void {
        // this.downloadUrl = 'https://jazzengel.nl'
        // this.downloadUrl = 'localhost:4200'
        this.initForm();
        const path = `videos`
        this.fs.collection(path).subscribe((videos: JazzengelVideo[]) => {
            console.log(videos);
            this.jazzengelVideos.set(videos)
        })
    }
    onEditVideo(video: JazzengelVideo) {
        this.clearAll();
        console.log(video)
        this.editmode = true;
        this.videoUnderConstruction.set(video)
        // console.log(this.videoUnderConstruction())
        this.downloadUrl = video.downloadUrl
        this.form.patchValue({
            title: video.title,
            date: new Date(video.date['seconds'] * 1000),
        })
        this.patchArtists(video.artists)
    }
    patchArtists(artists: ArtistForMedia[]) {
        let control = <FormArray>this.form.controls['artists']
        artists.forEach((artist: ArtistForMedia) => {
            control.push(this.fb.group(artist))
        })
    }

    initForm() {
        this.form = this.fb.group({
            title: new FormControl(null),
            date: new FormControl(new Date()),
            artists: this.fb.array([])
        })
    }
    artists(): FormArray {
        return this.form.get('artists') as FormArray;
    }
    addArtist() {
        this.artists().push(this.newArtist());
    }
    removeArtist(empIndex: number) {
        this.artists().removeAt(empIndex);
    }
    private clearArtistsFormArray() {
        while (this.artists().length !== 0) {
            this.artists().removeAt(0)
        }
    }
    newArtist(): FormGroup {
        return this.fb.group({
            name: '',
            instrument: '',
            // instruments: this.fb.array([])
        });
    }

    get controls() {
        return (this.form.get('artists') as FormArray).controls;
    }

    onFileInputChange(e: any) {
        this.file = e.target.files[0];
        const filename = this.file.name;
        this.fileLocation = `media/jazzengel-videos/${filename}`
        this.storage.storeFile(this.fileLocation, this.file).then((downloadUrl: string) => {
            this.downloadUrl = downloadUrl;
        })
    }

    onAddMedia() {
        console.log(this.form.value);


        const formvalue = this.form.value

        let artists: ArtistForMedia[] = formvalue.artists;

        console.log(artists)

        artists = artists.sort((a, b) => a.name.localeCompare(b.name))

        const mediaFileProperties: JazzengelVideo = {
            downloadUrl: this.downloadUrl,
            filename: this.file ? this.file.name : this.videoUnderConstruction().filename,
            title: formvalue.title,
            date: formvalue.date,
            artists: artists,
            fileLocation: this.editmode ? this.videoUnderConstruction().fileLocation : this.fileLocation
            // id: this.editmode ? this.videoUnderConstruction().id : ''

        }
        if (!this.editmode) {
            this.storeMediaData(mediaFileProperties)
                .then((docRef: DocumentReference) => {
                    console.log(docRef.id)
                    this.clearAll();
                    this.downloadUrl = 'localhost:4200';
                })
                .catch((err: FirebaseError) => {
                    console.error(err.message)
                });
        } else {
            this.updateJazzengelVideo(mediaFileProperties)
                .then((res: any) => {
                    console.log(res);
                    // (this.form.get('artists') as FormArray).controls = []
                    console.log(this.artists().length);
                    // while (this.artists().length !== 0) {
                    //     this.artists().removeAt(0)
                    // }
                    this.clearArtistsFormArray();
                    this.downloadUrl = 'localhost:4200'
                    this.clearAll();

                })
                .catch((err: FirebaseError) => {
                    console.error(err.message)
                })
        }
    }

    async uploadFile(path: string) {
        return await this.storage.storeFile(path, this.file)
    }

    storeMediaData(mediafileProperties: JazzengelVideo) {
        const path = `videos`
        return this.fs.addDoc(path, mediafileProperties)
    }
    updateJazzengelVideo(jazzengelVideo: JazzengelVideo) {
        const path = `videos/${this.videoUnderConstruction().id}`
        console.log(path)
        // return;
        return this.fs.updateDoc(path, jazzengelVideo)
    }

    clearAll() {
        this.form.reset();
        this.clearArtistsFormArray();
        this.downloadUrl = null;
        this.videoUnderConstruction.set(null);
        this.file = null;
        this.editmode = false;
    }
    onCancel() {
        this.router.navigateByUrl('/admin/upload-media')
    }
}
