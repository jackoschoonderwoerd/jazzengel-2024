import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
    name: 'capitalizeName',
    standalone: true
})
export class CapitalizeNamePipe implements PipeTransform {

    exeptions: string[] = [
        'van', 'der', 'den'
    ]

    constructor(private _sanitizer: DomSanitizer) {
    }

    transform(name: string): SafeHtml {
        const words: string[] = name.split(' ')
        words.forEach((word: string, index: number) => {
            if (!this.exeptions.includes(word)) {
                words[index] = word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
            }
        });
        const newName = words.join(' ')
        return newName;
    }

}
