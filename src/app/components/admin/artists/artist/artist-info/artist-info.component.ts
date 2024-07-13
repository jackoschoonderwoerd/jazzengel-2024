import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FirestoreService } from '../../../../../services/firestore.service';
import { Artist } from '../../../../../models/artist.model';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FirebaseError } from '@angular/fire/app';
import { MatDialogRef } from '@angular/material/dialog';
import { DocumentReference } from '@angular/fire/firestore';
import { capitalizeName } from '../../../helpers/capitalizeName';


@Component({
    selector: 'app-artist-info',
    standalone: true,
    imports: [
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatLabel,
        MatButtonModule
    ],
    templateUrl: './artist-info.component.html',
    styleUrl: './artist-info.component.scss'
})
export class ArtistInfoComponent implements OnInit {

    route = inject(ActivatedRoute);
    router = inject(Router)
    fs = inject(FirestoreService);
    fb = inject(FormBuilder);
    form!: FormGroup;
    editmode: boolean = false;
    id: string;



    ngOnInit(): void {
        this.initForm();
        this.route.params.subscribe((params: any) => {
            if (params && params.id !== undefined) {
                console.log(params.id)
                this.id = params.id
                this.editmode = true
                const path = `artists/${params.id}`
                this.fs.getDoc(path).subscribe((artist: Artist) => {
                    this.patchForm(artist)
                })
            }
        })
    }

    initForm() {
        this.form = this.fb.group({
            name: new FormControl(null, [Validators.required]),
            instrument: new FormControl(null, [Validators.required])
        })
    }
    patchForm(artist: Artist) {
        capitalizeName(artist.name).then((capitalizedArtistName: string) => {
            artist.name = capitalizedArtistName;
            this.form.patchValue({
                name: artist.name,
                instrument: artist.instrument
            })
        })
    }
    addArtist() {
        const formvalue = this.form.value
        if (this.editmode) {
            const path = `artists/${this.id}`
            const name = formvalue.name;
            this.fs.updateDoc(path, { name: name })
                .then((res: any) => {
                    console.log(`name updated; ${res}`)
                })
                .catch((err: FirebaseError) => {
                    console.error(`failed to update name; ${err.message}`)
                })
            const instrument = formvalue.instrument
            this.fs.updateDoc(path, { instrument: instrument })
                .then((res: any) => {
                    console.log(`instrument updated; ${res}`)
                })
                .catch((err: FirebaseError) => {
                    console.error(`failed to update instrument; ${err.message}`)
                })
                .then(() => {
                    this.router.navigate(['admin/artist', { id: this.id }])
                })
        } else {

            const artist: Artist = {
                name: formvalue.name,
                instrument: formvalue.instrument,
                biography: null,
                filePath: null,
                imageUrl: null
            }
            const path = `artists`
            this.fs.addDoc(path, artist)
                .then((docRef: DocumentReference) => {
                    console.log(`artist added; ${docRef.id}`)
                })
                .catch((err: FirebaseError) => {
                    console.error(`failed to add artist; ${err.message}`)
                })
        }
    }

    onCancel() {
        this.router.navigate(['admin/artist', { id: this.id }])
    }
}
