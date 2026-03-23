import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

export interface DropdownOption {
  label: string;
  value: string;
}

@Component({
  selector: 'app-dropdown',
  imports: [CommonModule, FormsModule],
  templateUrl: './dropdown.html',
  styleUrl: './dropdown.css',
})
export class Dropdown {
  @Input() label: string = '';
  @Input() id: string = '';
  @Input() placeholder: string = 'Select an option';
  @Input() options: DropdownOption[] = [];
  @Input() value: string = '';
  @Output() valueChange = new EventEmitter<string>();
}
