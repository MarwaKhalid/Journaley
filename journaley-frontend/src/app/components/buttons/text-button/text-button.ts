import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';

type ButtonType = 'delete' | 'cancel' | 'submit' | 'regular';

@Component({
  selector: 'app-text-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './text-button.html',
  styleUrl: './text-button.css',
})
export class TextButton {
  @Input() placeholder: string = 'placeholder';
  @Input() btn_type: ButtonType = 'regular';
  @Input() active: boolean = true;
  @Output() btnClick = new EventEmitter<void>();

  onClick() {
    this.btnClick.emit();
  }
}
