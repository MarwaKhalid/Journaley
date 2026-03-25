import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { InputField } from '../../components/input-field/input-field';
import { TextButton } from '../../components/buttons/text-button/text-button';

@Component({
  selector: 'app-create-city',
  imports: [MatDialogModule, MatButtonModule, InputField, TextButton],
  templateUrl: './create-city.html',
  styleUrl: './create-city.css',
})
export class CreateCity {
  cityName: string = '';
  readonly dialogRef = inject(MatDialogRef<CreateCity>);

  onSubmit() {
    if (!this.cityName.trim()) {
      return;
    }
    const result = { name: this.cityName };
    this.dialogRef.close(result);
  }
}
