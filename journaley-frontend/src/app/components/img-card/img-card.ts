import { Component, Input, Output, EventEmitter } from '@angular/core';
import { API_BASE_URL } from '../../core/api.config';

@Component({
  selector: 'app-img-card',
  imports: [],
  templateUrl: './img-card.html',
  styleUrl: './img-card.css',
})
export class ImgCard {
  /** Full URL from backend (e.g. http://localhost:8080/api/files/country-images/....) */
  @Input() imageUrl: string | null = null;
  /** Legacy: filename under assets/images (used when no imageUrl). */
  @Input() filename: string = '';
  @Input() title: string = '';
  @Input() showBtn: boolean = false;
  @Output() editClick = new EventEmitter<void>();
  @Output() deleteClick = new EventEmitter<void>();

  get src(): string {
    const url = this.imageUrl?.trim();
    if (url) {
      if (url.startsWith('http://') || url.startsWith('https://')) {
        return url;
      }
      if (url.startsWith('/api/')) {
        return `${API_BASE_URL}${url}`;
      }
    }
    if (!this.filename || this.filename === 'default.png') {
      const seed = encodeURIComponent((this.title || 'place').toLowerCase().replace(/\s+/g, '-'));
      return `https://picsum.photos/seed/journaley-${seed}/400/300`;
    }
    return 'assets/images/' + this.filename;
  }

  onEditClick(ev: MouseEvent): void {
    ev.stopPropagation();
    this.editClick.emit();
  }

  onTrashClick(ev: MouseEvent): void {
    ev.stopPropagation();
    this.deleteClick.emit();
  }
}
