import { Component } from '@angular/core';
import { TextButton } from '../../components/buttons/text-button/text-button';
import { DescriptionField } from '../../components/description-field/description-field';
import { RatingField } from '../../components/rating-field/rating-field';
import { SearchField } from '../../components/search-field/search-field';
import { UploadImageField } from '../../components/upload-image-field/upload-image-field';

@Component({
  selector: 'app-trip-highlights',
  imports: [
    TextButton,
    DescriptionField,
    UploadImageField,
    SearchField,
    RatingField,
  ],
  templateUrl: './trip-highlights.html',
  styleUrl: './trip-highlights.css',
})
export class TripHighlights {
  tripQuery = '';
  description = '';
  rating = 0;
  coverFile: File | null = null;

  onCoverChange(file: File | null): void {
    this.coverFile = file;
  }

  onSave(): void {
    console.log('Trip highlights', {
      tripQuery: this.tripQuery,
      description: this.description,
      rating: this.rating,
      coverFile: this.coverFile,
    });
  }
}
