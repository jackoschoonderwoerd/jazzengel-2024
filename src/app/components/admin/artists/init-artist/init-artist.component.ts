import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Artist } from '../../../../models/artist.model';
import { FirestoreService } from '../../../../services/firestore.service';
import { DocumentReference } from '@angular/fire/firestore';
import { capitalizeName } from '../../helpers/capitalizeName';

@Component({
    selector: 'app-init-artist',
    standalone: true,
    imports: [
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatLabel
    ],
    templateUrl: './init-artist.component.html',
    styleUrl: './init-artist.component.scss'
})
export class InitArtistComponent implements OnInit {

    fs = inject(FirestoreService)
    fb = inject(FormBuilder)
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
        const formValue = this.form.value
        const artist: Artist = {
            name: formValue.name,
            instrument: formValue.instrument,
            biography: null,
            filePath: null,
            imageUrl: null
        }
        capitalizeName(artist.name).then((artistName: string) => {
            artist.name = artistName;
            console.log(artist);
            const path = `artists`
            this.fs.addDoc(path, artist)
                .then((docRef: DocumentReference) => {
                    this.dialogRef.close(docRef.id)
                })
        })
    }

    // capitalizeName(name: string) {
    //     const promise = new Promise((resolve, reject) => {

    //         console.log(name)
    //         const uppercaseName: string = '';
    //         const exceptions: string[] = [
    //             'van', 'der', 'den', 'de', 'of', 'the', 'and'
    //         ]
    //         const nameSections: string[] = name.split(' ');
    //         console.log(nameSections)
    //         const nameSectionsLowerCase: string[] = []
    //         nameSections.forEach((section: string) => {
    //             nameSectionsLowerCase.push(section.toLowerCase())
    //         })
    //         console.log(nameSectionsLowerCase)
    //         const upperCasedSections: string[] = []
    //         nameSectionsLowerCase.forEach((section: string) => {

    //             if (!exceptions.includes(section)) {
    //                 section = section.charAt(0).toUpperCase() + section.slice(1).toLowerCase()
    //                 upperCasedSections.push(section)
    //             } else {
    //                 upperCasedSections.push(section);
    //             }
    //         })
    //         const upperCaseName = upperCasedSections.join(' ')
    //         resolve(upperCaseName)
    //     })
    //     return promise
    // }

}
