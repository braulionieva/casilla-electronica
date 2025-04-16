import { Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { ButtonModule } from 'primeng/button';
import { VisibleElementDirective } from 'src/app/shared/directive/visible-element.directive';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-terminos-condiciones',
  standalone: true,
  imports: [
    CommonModule,
    ScrollPanelModule,
    ButtonModule,
    VisibleElementDirective
  ],
  templateUrl: './terminos-condiciones.component.html',
  styleUrls: ['./terminos-condiciones.component.scss']
})
export class TerminosCondicionesComponent implements OnInit, OnDestroy {

  terms: string = '';
  @ViewChild('contentContainer', { static: true }) contentContainer!: ElementRef;
  private observer!: IntersectionObserver;
  constructor(
    public ref: DynamicDialogRef,
    private config: DynamicDialogConfig,

  ) { }

  ngOnInit(): void {
    this.terms = this.config.data.terms || '';
    this.addContent();
  }

  disableButton = true;

  onVisibilityChange(e: boolean) {
    this.disableButton = !e;
  }

  close(ok: boolean) {
    this.ref.close(ok);
  }

  addContent() {
    const container = this.contentContainer.nativeElement;
    container.innerHTML = this.terms;
    const paragraphs = container.querySelector('.visible');
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        this.disableButton = !entry.isIntersecting;
      });
    }, { threshold: 0.7 });

    this.observer.observe(paragraphs);

  }


  ngOnDestroy(): void {
    if (this.observer) {
      this.observer.disconnect();
    }
  }



}
