import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-description-field',
  imports: [FormsModule],
  templateUrl: './description-field.html',
  styleUrl: './description-field.css',
})
export class DescriptionField {
  @Input() label = 'Description';
  @Input() placeholder = 'Describe your experience';
  @Input() id = 'description';
  @Input() rows = 6;
  @Input() value = '';
  @Output() valueChange = new EventEmitter<string>();
}
