import { Pipe, PipeTransform } from '@angular/core';
import { Week } from '../utils/week.util';

@Pipe({ name: 'shortDay' })
export class ShortDayPipe implements PipeTransform {
  transform(value: string): string {
    return Week.DayAbbreviation(value);
  }
}
