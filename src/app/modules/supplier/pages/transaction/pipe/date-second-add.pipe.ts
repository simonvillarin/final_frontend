import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateSecondAdd',
})
export class DateSecondAddPipe implements PipeTransform {
  constructor(private datePipe: DatePipe) {}

  transform(inputDate: Date, daysToAdd: number): Date {
    const result = new Date(inputDate);
    result.setDate(result.getDate() + daysToAdd);
    return result;
  }

  formatDateAsTodayOrRegular(date: Date): string {
    const today = new Date();
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else {
      return this.datePipe.transform(date, 'mediumDate') || '';
    }
  }
}
