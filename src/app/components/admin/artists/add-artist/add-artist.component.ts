import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
    selector: 'app-add-artist',
    standalone: true,
    imports: [
        MatButtonModule,
        ReactiveFormsModule,
        MatInputModule,
        MatFormFieldModule,
        MatLabel
    ],
    templateUrl: './add-artist.component.html',
    styleUrl: './add-artist.component.scss'
})
export class AddArtistComponent implements OnInit {
    fb = inject(FormBuilder)
    data = inject(MAT_DIALOG_DATA);
    form!: FormGroup

    constructor(
        public dialogRef: MatDialogRef<AddArtistComponent>
    ) { }

    ngOnInit(): void {
        this.initForm()
    }
    initForm() {
        this.form = this.fb.group({

        })
    }

}
