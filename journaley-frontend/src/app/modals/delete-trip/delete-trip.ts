import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TextButton } from '../../components/buttons/text-button/text-button';

@Component({
  selector: 'app-delete-trip',
  imports: [MatDialogModule, MatButtonModule, TextButton],
  templateUrl: './delete-trip.html',
  styleUrl: './delete-trip.css',
})
export class DeleteTrip {
  readonly data = inject(MAT_DIALOG_DATA);
  readonly dialogRef = inject(MatDialogRef<DeleteTrip>);

  tripName: string = this.data.name;

  onSubmit() {
    this.dialogRef.close(true);
  }
}
