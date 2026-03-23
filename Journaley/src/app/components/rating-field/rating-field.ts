import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-rating-field',
  imports: [],
  templateUrl: './rating-field.html',
  styleUrl: './rating-field.css',
})
export class RatingField {
  @Input() label = 'Rating';
  @Input() rating = 0;
  @Input() maxStars = 5;
  /** When false, stars are buttons and `ratingChange` fires on click. */
  @Input() readonly = true;
  @Input() id = 'rating-field';
  @Output() ratingChange = new EventEmitter<number>();

  get starIndices(): number[] {
    return Array.from({ length: this.maxStars }, (_, i) => i + 1);
  }

  get filledCount(): number {
    const max = this.maxStars;
    const r = Number(this.rating);
    if (!Number.isFinite(r) || r < 0) {
      return 0;
    }
    return Math.min(max, Math.round(r));
  }

  get summaryLabel(): string {
    return `${this.label}: ${this.filledCount} out of ${this.maxStars} stars`;
  }

  select(star: number): void {
    if (this.readonly) {
      return;
    }
    this.ratingChange.emit(star);
  }
}
