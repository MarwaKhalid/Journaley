import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-img-card',
  imports: [],
  templateUrl: './img-card.html',
  styleUrl: './img-card.css',
})
export class ImgCard {
  @Input() filename: string = '';
  @Input() title: string = '';
  @Input() showBtn: boolean = false;
  @Output() btnClick = new EventEmitter<void>();

  get src(): string {
    return this.filename ? 'assets/images/' + this.filename : '...';
  }

  onClick() {
    this.btnClick.emit();
  }
}
