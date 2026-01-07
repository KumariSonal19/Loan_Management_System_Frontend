import { Pipe, PipeTransform } from '@angular/core';

type DateFormat = 'short' | 'medium' | 'long';

@Pipe({
  name: 'dateFormat',
  standalone: true
})
export class DateFormatPipe implements PipeTransform {

  transform(
    value: string | Date,
    format: DateFormat = 'medium',
    locale = 'en-IN'
  ): string {
    if (!value) return '';

    const date = typeof value === 'string' ? new Date(value) : value;
    if (isNaN(date.getTime())) return '';

    const formatOptions: Record<DateFormat, Intl.DateTimeFormatOptions> = {
      short: { year: 'numeric', month: '2-digit', day: '2-digit' },
      medium: { year: 'numeric', month: 'short', day: '2-digit' },
      long: { year: 'numeric', month: 'long', day: '2-digit' }
    };

    return new Intl.DateTimeFormat(locale, formatOptions[format]).format(date);
  }
}
