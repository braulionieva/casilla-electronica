import { AfterViewInit, Directive, ElementRef, EventEmitter, OnDestroy, Output } from '@angular/core';

/**
 * TODO: 
 * deprecate this directive and use IntersectionObserver directly instead.
 * terms & conditions 
 * 
 * @export
 * @class VisibleElementDirective
 */
@Directive({
  selector: '[appVisibleElement]',
  standalone: true
})
export class VisibleElementDirective implements AfterViewInit, OnDestroy {
  @Output() isVisible: EventEmitter<boolean> = new EventEmitter();
  private observer!: IntersectionObserver;

  constructor(private el: ElementRef) {
    
  }

  ngAfterViewInit(): void {
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        this.isVisible.emit(entry.isIntersecting);
      });
    }, { threshold: 0.7 });

    this.observer.observe(this.el.nativeElement);
  }

  ngOnDestroy(): void {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}