import { Directive, ElementRef, HostListener } from '@angular/core';
import { FocusVisibleService } from 'shared/services';

@Directive({
  selector: '[focusVisible]'
})
export class FocusVisibleDirective {
  @HostListener('focus')
  setInputFocus(): void {
    if (this._focusVisibleService.lastTrigger === 'keyboard') {
      this._elementRef.nativeElement.classList.add('has-focus');
    }
  }
  
  @HostListener('blur')
  setInputFocusOut(): void {
    this._elementRef.nativeElement.classList.remove('has-focus');
  }
  
  public get isFocused(): boolean {
    return this._elementRef.nativeElement.classList.contains('has-focus');
  }
  
  constructor(private _elementRef: ElementRef, private _focusVisibleService: FocusVisibleService) {
  }
  
  public focus(): void {
    this._elementRef.nativeElement.focus();
  }
  
  public blur(): void {
    this._elementRef.nativeElement.blur();
  }
}
