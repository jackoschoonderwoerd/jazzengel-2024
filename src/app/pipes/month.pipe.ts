import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'month',
    standalone: true
})
export class MonthPipe implements PipeTransform {

    transform(firstSunday: Date): any {
        switch (firstSunday.getMonth()) {
            case 0:
                return 'January';
                break;
            case 1:
                return 'February';
                break;
            case 2:
                return 'March';
                break;
            case 3:
                return 'April';
                break;
            case 4:
                return 'May';
                break;
            case 5:
                return 'June';
                break;
            case 6:
                return 'July (no jazz)';
                break;
            case 7:
                return 'August (no jazz)';
                break;
            case 8:
                return 'September';
                break;
            case 9:
                return 'October';
                break;
            case 10:
                return 'November';
                break;
            case 11:
                return 'December';
                break;
            default:
                console.log('problem pipe distributing sundays')
        }


    }

}
