import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-field',
  imports: [FormsModule],
  templateUrl: './search-field.html',
  styleUrl: './search-field.css',
})
export class SearchField {
  @Input() label = '';
  @Input() placeholder = 'Search by name';
  @Input() id = 'search';
  @Input() value = '';
  @Output() valueChange = new EventEmitter<string>();
}
