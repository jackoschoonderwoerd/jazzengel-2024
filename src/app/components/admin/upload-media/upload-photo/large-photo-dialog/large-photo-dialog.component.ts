import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-large-photo-dialog',
    imports: [],
    templateUrl: './large-photo-dialog.component.html',
    styleUrl: './large-photo-dialog.component.scss'
})
export class LargePhotoDialogComponent {
    data: any = inject(MAT_DIALOG_DATA);
    constructor(
        public dialogRef: MatDialogRef<LargePhotoDialogComponent>
    ) { }

    onClose() {
        this.dialogRef.close();
    }
}
