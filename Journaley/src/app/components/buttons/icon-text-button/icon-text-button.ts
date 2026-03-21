import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';

type ButtonType = 'add' | 'edit' | 'save';

@Component({
  selector: 'app-icon-text-button',
  imports: [CommonModule],
  templateUrl: './icon-text-button.html',
  styleUrl: './icon-text-button.css',
})
export class IconTextButton {
  @Input() btn_type: ButtonType = 'add';
  @Input() placeholder: string = '';
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
    console.log(this.btn_type);
    this.btnClick.emit();
  }
}
