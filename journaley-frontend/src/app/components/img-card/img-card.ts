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
  @Output() editClick = new EventEmitter<void>(); // Separate event for edit
  @Output() deleteClick = new EventEmitter<void>(); // Separate event for delete

  get src(): string {
    return this.filename ? 'assets/images/' + this.filename : '...';
  }

  onEditClick(ev: MouseEvent): void {
    ev.stopPropagation();
    this.editClick.emit();
  }

  onTrashClick(ev: MouseEvent): void {
    ev.stopPropagation();
    this.deleteClick.emit();
  }
}
