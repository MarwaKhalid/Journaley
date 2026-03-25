import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { InputField } from '../../components/input-field/input-field';
import { TextButton } from '../../components/buttons/text-button/text-button';
import { DescriptionField } from '../../components/description-field/description-field';
import { Dropdown, DropdownOption } from '../../components/dropdown/dropdown';
import { RatingField } from '../../components/rating-field/rating-field';

@Component({
  selector: 'app-edit-entry',
  imports: [
    MatDialogModule,
    MatButtonModule,
    InputField,
    TextButton,
    DescriptionField,
    Dropdown,
    RatingField,
  ],
  templateUrl: './edit-entry.html',
  styleUrl: './edit-entry.css',
})
export class EditEntry {
  readonly data = inject(MAT_DIALOG_DATA);
  readonly dialogRef = inject(MatDialogRef<EditEntry>);
  readonly cityOptions: DropdownOption[] = this.data.cityOptions || [];

  entryName: string = this.data.title;
  entryLocation: string = this.data.address;
  entryDescription: string = this.data.review;
  entryRating: number = this.data.rating;
  cityFilter = 'all';
  selectedCityId: string = this.data.cityId;

  onSubmit() {
    if (!this.entryName.trim()) return;

    this.dialogRef.close({
      title: this.entryName,
      address: this.entryLocation,
      review: this.entryDescription,
      rating: this.entryRating,
      cityId: this.selectedCityId,
    });
  }
}
