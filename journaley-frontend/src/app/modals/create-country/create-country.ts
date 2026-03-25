import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { InputField } from '../../components/input-field/input-field';
import { UploadImageField } from '../../components/upload-image-field/upload-image-field';
import { TextButton } from '../../components/buttons/text-button/text-button';

@Component({
  selector: 'app-create-country',
  imports: [MatDialogModule, MatButtonModule, InputField, UploadImageField, TextButton],
  templateUrl: './create-country.html',
  styleUrl: './create-country.css',
})
export class CreateCountry {
  countryName: string = '';
  readonly dialogRef = inject(MatDialogRef<CreateCountry>);
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
