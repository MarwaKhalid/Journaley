import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IconButton } from '../buttons/icon-button/icon-button';

/** Tab-aligned types for sketchbook entries (not Personal). */
export const SKETCHBOOK_ENTRY_ACTIVITY_OPTIONS = [
  'Restaurants',
  'Hotel',
  'Activities',
] as const;

export type SketchbookEntryActivity =
  (typeof SKETCHBOOK_ENTRY_ACTIVITY_OPTIONS)[number];

@Component({
  selector: 'app-info-card',
  imports: [IconButton],
  templateUrl: './info-card.html',
  styleUrl: './info-card.css',
})
export class InfoCard {
  @Input() title = '';
  @Input() address = '';
  @Input() review = '';
  @Input() rating = 5;
  /** City name for display (e.g. Tokyo). */
  @Input() cityLabel = '';
  /** Activity tab this entry belongs to (Restaurants, Hotel, Activities). */
  @Input() activityLabel = '';
  /** Suffix for unique form control ids (e.g. entry id). */
  @Input() activityFieldSuffix = '';
  /** When true, show a dropdown to change activity type instead of a static badge. */
  @Input() allowActivityChange = false;
  @Output() editClick = new EventEmitter<void>();
  @Output() deleteClick = new EventEmitter<void>();
  @Output() activityChange = new EventEmitter<SketchbookEntryActivity>();

  protected readonly starSlots: readonly number[] = [1, 2, 3, 4, 5];
  protected readonly activityOptions = SKETCHBOOK_ENTRY_ACTIVITY_OPTIONS;

  onActivitySelect(ev: Event): void {
    const v = (ev.target as HTMLSelectElement).value as SketchbookEntryActivity;
    this.activityChange.emit(v);
  }
}
