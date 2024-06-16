import { inject, Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from "@angular/platform-browser";

@Pipe({
    name: 'safe',
    standalone: true
})
export class SafePipe implements PipeTransform {

    sanitizer = inject(DomSanitizer)

    // constructor(private sanitizer: DomSanitizer) { }
    transform(url: any) {
        return this.sanitizer.bypassSecurityTrustResourceUrl(url);
    }

}
