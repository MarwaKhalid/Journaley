import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';

type ButtonDirection = 'left' | 'right';

@Component({
  selector: 'app-icon-button',
  imports: [CommonModule],
  templateUrl: './icon-button.html',
  styleUrl: './icon-button.css',
  host: {
    '[class.icon-button--large]': 'large',
  },
})
export class IconButton {
  /** When set (e.g. `plus-lg`, `trash3`), overrides caret icons from `direction`. */
  @Input() icon = '';
  @Input() ariaLabel = '';
  @Input() direction: ButtonDirection = 'left';
  /** Larger control (e.g. sidebar add +). */
  @Input() large = false;
  @Output() btnClick = new EventEmitter<void>();

  get iconClass(): string {
    if (this.icon) {
      return this.icon;
    }
    return this.direction === 'left' ? 'caret-left-fill' : 'caret-right-fill';
  }

  onClick() {
    this.btnClick.emit();
  }
}
