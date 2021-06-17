import { Pipe, PipeTransform } from '@angular/core';
import {min} from "rxjs/operators";

@Pipe({
  name: 'msFormat'
})
export class MsFormatPipe implements PipeTransform {

  transform(miliseconds: number): any {
    var days, hours, minutes, seconds, total_hours, total_minutes, total_seconds;

    total_seconds = (Math.floor(miliseconds / 1000));
    total_minutes = (Math.floor(total_seconds / 60));
    total_hours = (Math.floor(total_minutes / 60));
    days = (Math.floor(total_hours / 24));

    seconds = (total_seconds % 60);
    minutes = (total_minutes % 60);
    hours = (total_hours % 24);

    if(days != 0) return days + "j " + hours + "h " + minutes + "m " + seconds + "s";
    else if (hours != 0) return hours + "h " + minutes + "m " + seconds + "s";
    else if (minutes != 0) return minutes + "m " + seconds + "s";
    else return seconds + "s";

    return days + "d" + hours + "h" + minutes + "m" + seconds + "s";
    }

}
