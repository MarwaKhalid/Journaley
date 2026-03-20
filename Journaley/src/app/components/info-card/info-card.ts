import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-info-card',
  imports: [],
  templateUrl: './info-card.html',
  styleUrl: './info-card.css',
})
export class InfoCard {
  @Input() title: string = '';
  @Input() address: string = '';
  @Input() review: string = '';
}
