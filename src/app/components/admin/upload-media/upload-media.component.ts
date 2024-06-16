import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { StorageService } from '../../../services/storage.service';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule, MatLabel } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FirestoreService } from '../../../services/firestore.service';
import { FirebaseError } from '@angular/fire/app';
import { JazzengelVideo } from '../../../models/jazzengel-video';
import { NgFor } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { SafePipe } from '../../../pipes/safe.pipe';
// import { Artist } from '../../../models/artist.model';
import { ArtistForMedia } from '../../../models/artist-for-media';
import { DocumentReference } from '@angular/fire/firestore';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { VideoComponent } from './video/video.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { Router, RouterLink, RouterOutlet } from '@angular/router';



@Component({
    selector: 'app-upload-media',
    standalone: true,
    imports: [
        MatButtonModule,
        MatListModule,
        // ReactiveFormsModule,
        // MatInputModule,
        // MatLabel,
        // MatFormFieldModule,
        // NgFor,
        // MatIconModule,
        // SafePipe,
        // MatDatepickerModule,
        VideoComponent,
        MatToolbarModule,
        RouterOutlet,
        RouterLink

    ],
    templateUrl: './upload-media.component.html',
    styleUrl: './upload-media.component.scss',
})


export class UploadMediaComponent {

    router = inject(Router)

    onVideo() {
        this.router.navigateByUrl('admin/upload-media/jazzengel-video')
    }

    // formDisabled = false;
    // storage = inject(StorageService);
    // fs = inject(FirestoreService)
    // fb = inject(FormBuilder)
    // form: FormGroup = this.fb.group({

    //     title: ['']
    // })
    // file: File;
    // downloadUrl: string;

    // ngOnInit(): void {
    //     this.initForm()
    // }

    // initForm() {
    //     this.form = this.fb.group({
    //         title: new FormControl(null),
    //         date: new FormControl(new Date()),
    //         artists: this.fb.array([])
    //     })
    // }
    // artists(): FormArray {
    //     return this.form.get('artists') as FormArray;
    // }
    // addArtist() {
    //     this.artists().push(this.newArtist());
    // }
    // removeArtist(empIndex: number) {
    //     this.artists().removeAt(empIndex);
    // }
    // newArtist(): FormGroup {
    //     return this.fb.group({
    //         firstname: '',
    //         lastname: '',
    //         instrument: '',
    //         // instruments: this.fb.array([])
    //     });
    // }

    // get controls() {
    //     return (this.form.get('artists') as FormArray).controls;
    // }

    // onFileInputChange(e: any) {
    //     this.file = e.target.files[0];
    //     this.storeFile();
    // }

    // storeFile() {
    //     this.uploadFile().then((dowloadUrl: string) => {
    //         console.log(dowloadUrl);
    //         this.downloadUrl = dowloadUrl
    //     })
    // }

    // onAddMedia() {
    //     console.log(this.form.value);
    //     if (this.file) {
    //         this.uploadFile().then((dowloadUrl: string) => {
    //             console.log(dowloadUrl);
    //             this.downloadUrl = dowloadUrl
    //             const formvalue = this.form.value

    //             let artists: ArtistForMedia[] = formvalue.artists;

    //             console.log(artists)

    //             artists = artists.sort((a, b) => a.lastname.localeCompare(b.lastname))

    //             const mediaFileProperties: JazzengelVideo = {
    //                 downloadUrl: dowloadUrl,
    //                 filename: this.file.name,
    //                 title: formvalue.title,
    //                 date: formvalue.date,
    //                 artists: artists,
    //             }
    //             console.log(mediaFileProperties);
    //             return
    //             this.storeMediaData(mediaFileProperties)
    //                 .then((docRef: DocumentReference) => {
    //                     console.log(docRef.id)
    //                 })
    //                 .catch((err: FirebaseError) => {
    //                     console.error(err.message)
    //                 });
    //         })
    //     }
    // }

    // async uploadFile() {

    //     const filename = this.file.name;
    //     const path = `media/${filename}`

    //     return await this.storage.storeFile(path, this.file)
    // }

    // storeMediaData(mediafileProperties: JazzengelVideo) {
    //     const path = `media`
    //     return this.fs.addDoc(path, mediafileProperties)
    // }
}
