import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar'
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-admin',
    standalone: true,
    imports: [MatToolbarModule, RouterModule],
    templateUrl: './admin.component.html',
    styleUrl: './admin.component.scss'
})
export class AdminComponent {
    componentNames: string[] = ['stats', 'artists', 'concerts'];


}
