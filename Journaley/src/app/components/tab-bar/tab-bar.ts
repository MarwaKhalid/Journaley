import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-tab-bar',
  imports: [CommonModule],
  templateUrl: './tab-bar.html',
  styleUrl: './tab-bar.css',
})
export class TabBar {
  content = 'Restaurants';
  @Output() btnClick = new EventEmitter<void>();
  @Output() categoryChange = new EventEmitter<string>();

  setContent(content: string): void {
    this.content = content;
    this.categoryChange.emit(content);
  }

  onClick() {
    this.btnClick.emit();
  }
}
