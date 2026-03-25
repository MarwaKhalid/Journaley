import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { InputField } from '../../components/input-field/input-field';
import { UploadImageField } from '../../components/upload-image-field/upload-image-field';
import { TextButton } from '../../components/buttons/text-button/text-button';

@Component({
  selector: 'app-create-entry',
  imports: [MatDialogModule, MatButtonModule, InputField, UploadImageField, TextButton],
  templateUrl: './create-entry.html',
  styleUrl: './create-entry.css',
})
export class CreateEntry {
  entryName: string = '';
  readonly dialogRef = inject(MatDialogRef<CreateEntry>);

  onSubmit() {
    this.dialogRef.close(this.entryName);
  }
}
