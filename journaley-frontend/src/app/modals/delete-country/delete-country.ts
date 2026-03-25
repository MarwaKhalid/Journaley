import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TextButton } from '../../components/buttons/text-button/text-button';

@Component({
  selector: 'app-delete-country',
  imports: [MatDialogModule, MatButtonModule, TextButton],
  templateUrl: './delete-country.html',
  styleUrl: './delete-country.css',
})
export class DeleteCountry {
  readonly data = inject(MAT_DIALOG_DATA);
  readonly dialogRef = inject(MatDialogRef<DeleteCountry>);

  countryName: string = this.data.name;

  onSubmit() {
    this.dialogRef.close(this.countryName);
  }
}
