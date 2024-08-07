import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
    name: 'capitalizeName',
    standalone: true
})
export class CapitalizeNamePipe implements PipeTransform {

    exceptions: string[] = [
        'van', 'der', 'den', 'de', 'of', 'the', 'and'
    ]

    constructor(private _sanitizer: DomSanitizer) {
    }

    transform(name: string): SafeHtml {
        if (name) {
            console.log(name)
            const words: string[] = name.split(' ')
            words.forEach((word: string, index: number) => {
                if (!this.exceptions.includes(word)) {
                    words[index] = word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                }
            });
            const newName = words.join(' ')
            // console.log(newName)
            return newName;
        }
    }

}
