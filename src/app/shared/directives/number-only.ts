import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appNumberOnly]',
  standalone: true
})
export class NumberOnlyDirective {

  private allowedKeys = [
    'Backspace',
    'Tab',
    'End',
    'Home',
    'ArrowLeft',
    'ArrowRight',
    'Delete'
  ];

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
   
    if (this.allowedKeys.includes(event.key)) {
      return;
    }
    if ((event.ctrlKey || event.metaKey) && ['a', 'c', 'v', 'x'].includes(event.key.toLowerCase())) {
      return;
    }

    if (/^\d$/.test(event.key)) {
      return;
    }

    const input = event.target as HTMLInputElement;

    if (event.key === '.' && !input.value.includes('.')) {
      return;
    }

    event.preventDefault();
  }

  @HostListener('paste', ['$event'])
  onPaste(event: ClipboardEvent): void {
    const pastedText = event.clipboardData?.getData('text') ?? '';

    if (!/^\d*\.?\d*$/.test(pastedText)) {
      event.preventDefault();
    }
  }
}