import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-numero-caso',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './numero-caso.component.html',
  styleUrls: ['./numero-caso.component.scss']
})
export class NumeroCasoComponent implements OnInit {

  @Input() numeroCaso: string = ''

  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    /** Empty  */
  }

  private splitCaso(numeroCaso: string) {
    const caso = numeroCaso?.split('-');

    if (caso.length<4)
      return ''

    return `<div>${ caso[0] }-${ caso[1] }-<span>${ caso[2] }-${ caso[3] }</span></div>`
  }

  get htmlCaso(): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(this.splitCaso(this.numeroCaso))
  }



}
