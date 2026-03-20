import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-img-card',
  imports: [],
  templateUrl: './img-card.html',
  styleUrl: './img-card.css',
})
export class ImgCard {
  @Input() filename: string = '';

  get src(): string {
    return this.filename ? 'assets/images/' + this.filename : '...';
  }
}
