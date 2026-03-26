import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { TextButton } from '../../components/buttons/text-button/text-button';

interface NoticeModalData {
  title: string;
  message: string;
}

@Component({
  selector: 'app-notice-modal',
  imports: [MatDialogModule, TextButton],
  templateUrl: './notice-modal.html',
  styleUrl: './notice-modal.css',
})
export class NoticeModal {
  readonly data = inject<NoticeModalData>(MAT_DIALOG_DATA);
  readonly dialogRef = inject(MatDialogRef<NoticeModal>);
}
