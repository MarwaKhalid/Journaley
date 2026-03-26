import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IconTextButton } from '../buttons/icon-text-button/icon-text-button';

export interface TripHighlightPhoto {
  imageSrc: string;
  /** Optional; defaults for accessibility when missing. */
  alt?: string;
}

const DEFAULT_PHOTOS: TripHighlightPhoto[] = [
  { imageSrc: 'https://picsum.photos/seed/journaley-ramen/400/400', alt: 'Bowl of ramen' },
  { imageSrc: 'https://picsum.photos/seed/journaley-temple/400/400', alt: 'Pagoda at sunset' },
  { imageSrc: 'https://picsum.photos/seed/journaley-beach/400/400', alt: 'Friends on the beach' },
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
  @Input() photos: TripHighlightPhoto[] = DEFAULT_PHOTOS;
  /** Comma-separated names or a single string, e.g. "A, B, C". */
  @Input() traveledWith = 'A, B, C';
  /** When false, hide the Edit Trip action. */
  @Input() canEdit = false;
  @Output() editTrip = new EventEmitter<void>();

  onEdit(): void {
    this.editTrip.emit();
  }
}
