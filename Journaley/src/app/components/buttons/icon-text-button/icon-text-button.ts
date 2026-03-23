import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';

type ButtonType = 'add' | 'edit' | 'save';
type IconTextVariant = 'default' | 'muted';

@Component({
  selector: 'app-icon-text-button',
  imports: [CommonModule],
  templateUrl: './icon-text-button.html',
  styleUrl: './icon-text-button.css',
  host: {
    '[class.icon-text-button--muted]': 'variant === "muted"',
  },
})
export class IconTextButton {
  @Input() btn_type: ButtonType = 'add';
  @Input() placeholder: string = '';
  /** Compact gray pill for headers (e.g. Edit Trip on trip highlights). */
  @Input() variant: IconTextVariant = 'default';
  @Output() btnClick = new EventEmitter<void>();

  get icon(): string {
    switch (this.btn_type) {
      case 'add':
        return 'plus-lg';
      case 'edit':
        return 'pen';
      case 'save':
        return 'floppy';
      default:
        return '';
    }
  }

  onClick() {
    this.btnClick.emit();
  }
}
