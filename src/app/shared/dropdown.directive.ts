import { Directive, HostBinding, HostListener, ElementRef } from '@angular/core';

@Directive ({
    selector: '[appDropdown]',
    standalone: false
})
export class DropdownDirective {
  @HostBinding('class.open') isOpen = false;
  
  @HostListener('document:click', ['$event']) toggleOpen(event: Event) {
    event.preventDefault();  // avoids nav in href="#"
    event.stopPropagation();// avoids click to close dropdown immediately
    this.isOpen = this.elRef.nativeElement.contains(event.target) ? !this.isOpen : false;
  }
  constructor(private elRef: ElementRef) {}
}