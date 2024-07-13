import { Component, inject } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar'
import { RouterModule } from '@angular/router';
import { AdminStore } from './admin.store';
import { JsonPipe } from '@angular/common';

@Component({
    selector: 'app-admin',
    standalone: true,
    imports: [MatToolbarModule, RouterModule, JsonPipe],
    templateUrl: './admin.component.html',
    styleUrl: './admin.component.scss'
})
export class AdminComponent {
    componentNames: string[] = ['stats', 'artists', 'concerts'];



}
