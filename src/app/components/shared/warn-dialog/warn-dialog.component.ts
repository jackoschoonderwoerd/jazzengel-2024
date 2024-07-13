import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-warn-dialog',
    standalone: true,
    imports: [MatDialogModule, MatButtonModule, MatIconModule],
    templateUrl: './warn-dialog.component.html',
    styleUrl: './warn-dialog.component.scss'
})
export class WarnDialogComponent {

    data = inject(MAT_DIALOG_DATA)

    constructor(public dialogRef: MatDialogRef<WarnDialogComponent>) { }
}
