import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { InputField } from '../../components/input-field/input-field';
import { UploadImageField } from '../../components/upload-image-field/upload-image-field';
import { TextButton } from '../../components/buttons/text-button/text-button';

@Component({
  selector: 'app-create-trip',
  imports: [MatDialogModule, MatButtonModule, InputField, UploadImageField, TextButton],
  templateUrl: './create-trip.html',
  styleUrl: './create-trip.css',
})
export class CreateTrip {
  tripName: string = '';
  readonly dialogRef = inject(MatDialogRef<CreateTrip>);

  onSubmit() {
    this.dialogRef.close(this.tripName);
  }
}
