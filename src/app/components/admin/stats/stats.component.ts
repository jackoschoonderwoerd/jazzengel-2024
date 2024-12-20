import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule, RouterOutlet } from '@angular/router';

@Component({
    selector: 'app-stats',
    imports: [RouterOutlet, MatToolbarModule, RouterModule],
    templateUrl: './stats.component.html',
    styleUrl: './stats.component.scss'
})
export class StatsComponent {
    componentNames: string[] = ['musicians-appearance', 'appearance'];
}
