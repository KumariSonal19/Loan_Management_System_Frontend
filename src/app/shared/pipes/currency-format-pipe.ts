import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'currencyFormat',
  standalone: true
})
export class CurrencyFormatPipe implements PipeTransform {

  transform(
    value: number | string,
    currency = '₹',
    locale = 'en-IN'
  ): string {
    if (value === null || value === undefined || value === '') {
      return '';
    }

    const num = typeof value === 'string' ? Number(value) : value;
    if (isNaN(num)) return '';

    return currency + new Intl.NumberFormat(locale, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(num);
  }
}
