import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { InputField } from '../../components/input-field/input-field';
import { UploadImageField } from '../../components/upload-image-field/upload-image-field';
import { TextButton } from '../../components/buttons/text-button/text-button';

@Component({
  selector: 'app-edit-country',
  imports: [MatDialogModule, MatButtonModule, InputField, UploadImageField, TextButton],
  templateUrl: './edit-country.html',
  styleUrl: './edit-country.css',
})
export class EditCountry {
  readonly data = inject(MAT_DIALOG_DATA); // Receives the city data
  readonly dialogRef = inject(MatDialogRef<EditCountry>);

  countryName: string = this.data.name; // Initialize with the existing name

  onSubmit() {
    this.dialogRef.close(this.countryName);
  }
}
