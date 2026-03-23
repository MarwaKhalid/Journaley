import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IconTextButton } from '../buttons/icon-text-button/icon-text-button';

export interface TripHighlightCard {
  imageSrc: string;
  label: string;
  value: string;
}

const DEFAULT_CARDS: TripHighlightCard[] = [
  {
    imageSrc: 'https://picsum.photos/seed/journaley-ramen/400/400',
    label: 'Favorite Restaurant',
    value: 'Neotokyo',
  },
  {
    imageSrc: 'https://picsum.photos/seed/journaley-temple/400/400',
    label: 'Favorite City',
    value: 'Tokyo',
  },
  {
    imageSrc: 'https://picsum.photos/seed/journaley-beach/400/400',
    label: 'People Traveled With',
    value: 'A, B, C',
  },
];

@Component({
  selector: 'app-trip-highlights-main',
  imports: [IconTextButton],
  templateUrl: './trip-highlights-main.html',
  styleUrl: './trip-highlights-main.css',
})
export class TripHighlightsMain {
  @Input() heading = 'Trip Highlights';
  @Input() bodyText =
    'Our two-week adventure through Japan was unforgettable, from the neon-lit streets of Tokyo to the serene temples of Kyoto. The trip was perfectly timed for cherry blossom season.';
  @Input() cards: TripHighlightCard[] = DEFAULT_CARDS;
  @Output() editTrip = new EventEmitter<void>();

  onEdit(): void {
    this.editTrip.emit();
  }
}
