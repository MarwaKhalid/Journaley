import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { InputField } from '../../components/input-field/input-field';
import { DescriptionField } from '../../components/description-field/description-field';
import { TextButton } from '../../components/buttons/text-button/text-button';
import { Dropdown, DropdownOption } from '../../components/dropdown/dropdown';
import { RatingField } from '../../components/rating-field/rating-field';

@Component({
  selector: 'app-create-entry-dialog',
  imports: [
    MatDialogModule,
    MatButtonModule,
    InputField,
    DescriptionField,
    TextButton,
    Dropdown,
    RatingField,
  ],
  templateUrl: './create-entry.html',
  styleUrl: './create-entry.css',
})
export class CreateEntry {
  readonly data = inject(MAT_DIALOG_DATA);
  readonly dialogRef = inject(MatDialogRef<CreateEntry>);

  entryName: string = '';
  entryLocation: string = '';
  entryDescription: string = '';
  entryRating: number = 5;
  selectedCityId: string = this.data.cityId;
  selectedCategory: string = this.data.category ?? 'Restaurants';

  readonly cityOptions: DropdownOption[] = this.data.cityOptions || [];
  readonly categoryOptions: DropdownOption[] = [
    { label: 'Restaurants', value: 'Restaurants' },
    { label: 'Hotel', value: 'Hotel' },
    { label: 'Activities', value: 'Activities' },
  ];

  onSubmit() {
    if (!this.entryName.trim()) return;

    this.dialogRef.close({
      title: this.entryName,
      address: this.entryLocation,
      review: this.entryDescription,
      rating: this.entryRating,
      cityId: this.selectedCityId,
      category: this.selectedCategory,
    });
  }
}
