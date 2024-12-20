import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Artist } from '../../../../models/artist.model';
import { FirestoreService } from '../../../../services/firestore.service';
import { DocumentReference } from '@angular/fire/firestore';
import { capitalizeName } from '../../helpers/capitalizeName';
import { FirebaseError } from '@angular/fire/app';
import { SnackbarService } from '../../shared/snackbar.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-init-artist',
    imports: [
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatLabel,
        MatDialogModule
    ],
    templateUrl: './init-artist.component.html',
    styleUrl: './init-artist.component.scss'
})
export class InitArtistComponent implements OnInit {

    fs = inject(FirestoreService)
    fb = inject(FormBuilder);
    router = inject(Router)
    snackbarService = inject(SnackbarService)
    form: FormGroup

    constructor(private dialogRef: MatDialogRef<InitArtistComponent>) { }

    ngOnInit(): void {
        this.initForm()
    }

    initForm() {
        this.form = this.fb.group({
            name: new FormControl(null, [Validators.required]),
            instrument: new FormControl(null, [Validators.required])
        })
    }
    addArtist() {
        const formValue = this.form.value;
        capitalizeName(formValue.name).then((capitalizedName: string) => {

            const artist: Artist = {
                name: capitalizedName,
                instrument: formValue.instrument,
                biography: null,
                filePath: null,
                imageUrl: null
            }
            const path = `artists`
            this.fs.addDoc(path, artist)
                .then((docRef: DocumentReference) => {
                    this.dialogRef.close(docRef.id)
                })
                .catch((err: FirebaseError) => {
                    this.snackbarService.openSnackbar(`Operation failed due to: ${err.message}`);
                    this.router.navigateByUrl('/admin/artists');
                })
        })
    }
    onCancel() {

    }



}
