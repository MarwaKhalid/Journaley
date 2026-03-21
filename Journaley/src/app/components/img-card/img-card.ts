import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-img-card',
  imports: [],
  templateUrl: './img-card.html',
  styleUrl: './img-card.css',
})
export class ImgCard {
  @Input() filename: string = '';
  @Input() title: string = '';
  @Input() dates: string = '';

  get src(): string {
    return this.filename ? 'assets/images/' + this.filename : '...';
  }

  onEditClick(): void {
    console.log('Edit button clicked!');
  }

  onDeleteClick(): void {
    console.log('Delete button clicked!');
  }
}
