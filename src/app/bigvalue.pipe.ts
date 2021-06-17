import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'bigvalue'
})
export class BigvaluePipe implements PipeTransform {

  transform(input: any, args?: any): any {
    var exp, rounded,
      suffixes = ['000 Pétous', 'Million(s) de Pétous', 'GigaPétous', 'TeraPétous', 'PetaPétous', 'ExaPétous'];

    if (Number.isNaN(input)) {
      return null;
    }

    if (input < 1000) {
      return input + " Pétous";
    }

    exp = Math.floor(Math.log(input) / Math.log(1000));

    return '€ ' + (input / Math.pow(1000, exp)).toFixed(args) + ' ' +suffixes[exp - 1];


  }

}
