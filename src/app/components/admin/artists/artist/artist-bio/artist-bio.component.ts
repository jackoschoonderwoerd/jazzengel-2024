import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FirestoreService } from '../../../../../services/firestore.service';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Artist } from '../../../../../models/artist.model';
import { MatButtonModule } from '@angular/material/button';
import { EditorModule } from '@tinymce/tinymce-angular';
import { FirebaseError } from '@angular/fire/app';
import { SnackbarService } from '../../../shared/snackbar.service';

@Component({
    selector: 'app-artist-bio',
    imports: [EditorModule, ReactiveFormsModule, MatButtonModule],
    templateUrl: './artist-bio.component.html',
    styleUrl: './artist-bio.component.scss'
})
export class ArtistBioComponent implements OnInit {

    @Output() editorChanged = new EventEmitter<string>()

    tinymceInit =
        {
            plugins: 'lists link image table code help wordcount save',
            selector: 'textarea',  // change this value according to your HTML

        }

    route = inject(ActivatedRoute);
    router = inject(Router)
    fs = inject(FirestoreService);
    fb = inject(FormBuilder);
    form!: FormGroup;
    snackbar = inject(SnackbarService)
    editmode: boolean = false;
    id: string

    ngOnInit(): void {
        this.initForm();
        this.route.params.subscribe((params: any) => {
            if (params.id) {
                this.id = params.id
                this.editmode = true
                const path = `artists/${params.id}`
                this.fs.getDoc(path).subscribe((artist: Artist) => {
                    this.patchForm(artist.biography)
                })
            }
        })
        this.form.controls['editor'].valueChanges.subscribe((bio: string) => {
            this.editorChanged.emit(bio)
        })
    }
    initForm() {
        this.form = this.fb.group({
            editor: new FormControl('jacko', [Validators.required]),
        })
    }
    patchForm(biography: string) {
        this.form.patchValue({
            editor: biography,

        })
    }
    onCancel() {
        this.router.navigate(['admin/artist', { id: this.id }])
    }
    onSaveChanges() {

        const biography = this.form.value.editor;
        const path = `artists/${this.id}`
        this.fs.updateDoc(path, { biography: biography })
            .then((res: any) => {
                console.log(`biography updated; ${res}`)
                this.router.navigate(['admin/artist', { id: this.id }])
            })
            .catch((err: FirebaseError) => {
                this.snackbar.openSnackbar(`Operation failed due to: '${err.message}`)
            })
    }
}
