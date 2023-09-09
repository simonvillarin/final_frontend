import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateAdd',
})
export class DateAddPipe implements PipeTransform {
  transform(inputDate: Date, daysToAdd: number): Date {
    const result = new Date(inputDate);
    result.setDate(result.getDate() + daysToAdd);
    return result;
  }
}
