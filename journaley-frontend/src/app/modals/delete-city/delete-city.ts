import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TextButton } from '../../components/buttons/text-button/text-button';

@Component({
  selector: 'app-delete-city',
  imports: [MatDialogModule, MatButtonModule, TextButton],
  templateUrl: './delete-city.html',
  styleUrl: './delete-city.css',
})
export class DeleteCity {
  readonly data = inject(MAT_DIALOG_DATA);
  readonly dialogRef = inject(MatDialogRef<DeleteCity>);

  cityName: string = this.data.label;

  onSubmit() {
    this.dialogRef.close(true);
  }
}
