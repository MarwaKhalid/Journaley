// create-trip.ts
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TextButton } from '../../components/buttons/text-button/text-button';
import { InputField } from '../../components/input-field/input-field';
import { DescriptionField } from '../../components/description-field/description-field';
import { UploadImageField } from '../../components/upload-image-field/upload-image-field';

@Component({
  selector: 'app-create-trip',
  imports: [
    MatDialogModule,
    MatButtonModule,
    TextButton,
    InputField,
    DescriptionField,
    UploadImageField,
  ],
  templateUrl: './create-trip.html',
  styleUrl: './create-trip.css',
})
export class CreateTrip {
  readonly data = inject(MAT_DIALOG_DATA);
  readonly dialogRef = inject(MatDialogRef<CreateTrip>);

  tripName: string = '';
  tripSummary: string = '';
  tripPeople: string = '';
  image1: File | null = null;
  image2: File | null = null;
  image3: File | null = null;

  onImage1Change(file: File | null) {
    this.image1 = file;
  }

  onImage2Change(file: File | null) {
    this.image2 = file;
  }

  onImage3Change(file: File | null) {
    this.image3 = file;
  }

  onSubmit() {
    if (!this.tripName.trim()) return;

    this.dialogRef.close({
      name: this.tripName,
      summary: this.tripSummary,
      people: this.tripPeople,
      image1: this.image1,
      image2: this.image2,
      image3: this.image3,
      countryKey: this.data?.countryKey,
    });
  }
}
