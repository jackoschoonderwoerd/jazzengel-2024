import { Component, inject } from '@angular/core';
import { AdminStore } from '../admin.store';
import { JsonPipe } from '@angular/common';

@Component({
    selector: 'app-store',
    imports: [JsonPipe],
    templateUrl: './store.component.html',
    styleUrl: './store.component.scss'
})
export class StoreComponent {
    adminStore = inject(AdminStore)
}
