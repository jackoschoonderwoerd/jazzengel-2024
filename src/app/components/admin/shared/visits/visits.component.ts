import { Component, inject } from '@angular/core';

import { DatePipe, JsonPipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { VisitsStore } from './visits.store';
import { Visit } from '../../../../models/visit.model';


@Component({
    selector: 'app-visits',
    standalone: true,
    imports: [DatePipe, MatIconModule, MatButtonModule, JsonPipe],
    templateUrl: './visits.component.html',
    styleUrl: './visits.component.scss'
})
export class VisitsComponent {
    // countVisitorsService = inject(CountVisitorsService)
    // fs = inject(FirestoreService)
    visitsStore = inject(VisitsStore)

    onDeleteForever(doomedvisit: Visit) {
        this.visitsStore.deleteVisit(doomedvisit)
        // console.log(id)
        // this.fs.deleteDoc(`visitors/${id}`)
        //     .then((res: any) => console.log(res))
        //     .catch((err: any) => console.error(err))

    }
}
