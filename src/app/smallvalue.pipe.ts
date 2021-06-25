import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'smallvalue'
})
export class SmallvaluePipe implements PipeTransform {

  transform(input: any, args?: any): any {
    var exp, rounded,
      suffixes = ['Millions', 'Milliards', 'Billions', 'Billiards', 'Trillions', 'Quatrillions', 'Quintillions', 'Sextillions', 'Septillions','Octillions', 'Nonillions'];

    if (Number.isNaN(input)) {
      return null;
    }

    if (input < 1000) {
      return input.toFixed(2);
    }

    if (input < 1000000) {
      return input.toFixed(2);
    }

    exp = Math.floor(Math.log(input) / Math.log(1000));

    return (input / Math.pow(1000, exp)).toFixed(2) + ' ' +suffixes[exp - 2];


  }

}
