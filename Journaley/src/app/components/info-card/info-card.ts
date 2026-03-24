import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IconButton } from '../buttons/icon-button/icon-button';

@Component({
  selector: 'app-info-card',
  imports: [IconButton],
  templateUrl: './info-card.html',
  styleUrl: './info-card.css',
})
export class InfoCard {
  @Input() title = '';
  @Input() address = '';
  @Input() review = '';
  @Input() rating = 5;
  @Output() editClick = new EventEmitter<void>();
  @Output() deleteClick = new EventEmitter<void>();

  protected readonly starSlots: readonly number[] = [1, 2, 3, 4, 5];
}
