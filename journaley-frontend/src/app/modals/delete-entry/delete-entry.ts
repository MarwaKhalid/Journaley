import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TextButton } from '../../components/buttons/text-button/text-button';

@Component({
  selector: 'app-delete-entry',
  imports: [MatDialogModule, MatButtonModule, TextButton],
  templateUrl: './delete-entry.html',
  styleUrl: './delete-entry.css',
})
export class DeleteEntry {
  readonly data = inject(MAT_DIALOG_DATA);
  readonly dialogRef = inject(MatDialogRef<DeleteEntry>);

  entryName: string = this.data.title;

  onSubmit() {
    this.dialogRef.close(true);
  }
}
