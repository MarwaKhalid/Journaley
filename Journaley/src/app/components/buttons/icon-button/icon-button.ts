import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

type ButtonDirection = 'left' | 'right';

@Component({
  selector: 'app-icon-button',
  imports: [CommonModule],
  templateUrl: './icon-button.html',
  styleUrl: './icon-button.css',
})
export class IconButton {
  @Input() direction: ButtonDirection = 'left';
}
