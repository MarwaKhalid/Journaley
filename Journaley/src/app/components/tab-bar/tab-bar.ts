import { CommonModule } from '@angular/common';
import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-tab-bar',
  imports: [CommonModule],
  templateUrl: './tab-bar.html',
  styleUrl: './tab-bar.css',
})
export class TabBar {
  content = 'Restaurant';
  @Output() btnClick = new EventEmitter<void>();

  setContent(content: string): void {
    this.content = content;
  }

  onClick() {
    this.btnClick.emit();
  }
}
