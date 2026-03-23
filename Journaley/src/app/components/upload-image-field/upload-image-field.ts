import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-upload-image-field',
  imports: [],
  templateUrl: './upload-image-field.html',
  styleUrl: './upload-image-field.css',
})
export class UploadImageField implements OnDestroy {
  @Input() label = 'Upload Image';
  @Input() hint = 'Drop Image Here';
  @Input() inputId = 'upload-image-input';
  @Input() accept = 'image/png,image/jpeg,image/jpg,image/webp,image/gif';
  @Output() fileChange = new EventEmitter<File | null>();

  @ViewChild('fileInput') fileInputRef?: ElementRef<HTMLInputElement>;

  previewUrl: string | null = null;
  private objectUrl: string | null = null;

  pickFile(): void {
    this.fileInputRef?.nativeElement.click();
  }

  onInputChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;
    if (file && !file.type.startsWith('image/')) {
      input.value = '';
      return;
    }
    this.applyFile(file);
    input.value = '';
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'copy';
    }
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    const file = event.dataTransfer?.files?.[0];
    if (file && file.type.startsWith('image/')) {
      this.applyFile(file);
    }
  }

  private applyFile(file: File | null): void {
    this.revokeObjectUrl();
    if (file) {
      this.objectUrl = URL.createObjectURL(file);
      this.previewUrl = this.objectUrl;
    } else {
      this.previewUrl = null;
    }
    this.fileChange.emit(file);
  }

  private revokeObjectUrl(): void {
    if (this.objectUrl) {
      URL.revokeObjectURL(this.objectUrl);
      this.objectUrl = null;
    }
    this.previewUrl = null;
  }

  ngOnDestroy(): void {
    this.revokeObjectUrl();
  }
}
