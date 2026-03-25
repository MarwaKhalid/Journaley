import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { InputField } from '../../components/input-field/input-field';
import { UploadImageField } from '../../components/upload-image-field/upload-image-field';
import { TextButton } from '../../components/buttons/text-button/text-button';
import type { Country } from '../../models/country.model';

export interface EditCountryResult {
  name: string;
  file?: File | null;
}

@Component({
  selector: 'app-edit-country',
  imports: [MatDialogModule, MatButtonModule, InputField, UploadImageField, TextButton],
  templateUrl: './edit-country.html',
  styleUrl: './edit-country.css',
})
export class EditCountry {
  readonly data = inject<Country>(MAT_DIALOG_DATA);
  readonly dialogRef = inject(MatDialogRef<EditCountry, EditCountryResult>);

  countryName: string = this.data.name;
  imageFile: File | null = null;

  onImageChange(file: File | null) {
    this.imageFile = file;
  }

  onSubmit() {
    this.dialogRef.close({
      name: this.countryName,
      file: this.imageFile,
    });
  }
}
