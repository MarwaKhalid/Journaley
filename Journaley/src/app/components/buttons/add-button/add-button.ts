import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-add-button',
  imports: [],
  templateUrl: './add-button.html',
  styleUrl: './add-button.css',
})
export class AddButton {
  @Input() placeholder: string = '';

  onAddClick(): void {
    console.log('Add clicked');
  }
}
