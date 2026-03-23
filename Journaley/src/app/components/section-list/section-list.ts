import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IconButton } from '../buttons/icon-button/icon-button';

export interface SectionListItem {
  id: string;
  label: string;
  /** When false, no delete icon (e.g. “All cities”). Omit or true for deletable rows. */
  deletable?: boolean;
}

@Component({
  selector: 'app-section-list',
  imports: [IconButton],
  templateUrl: './section-list.html',
  styleUrl: './section-list.css',
})
export class SectionList {
  @Input({ required: true }) title!: string;
  @Input() items: SectionListItem[] = [];
  @Output() addClick = new EventEmitter<void>();
  @Output() deleteClick = new EventEmitter<SectionListItem>();
  @Output() rowClick = new EventEmitter<SectionListItem>();

  onAdd(): void {
    this.addClick.emit();
  }

  onRowClick(item: SectionListItem): void {
    this.rowClick.emit(item);
  }

  onDelete(item: SectionListItem): void {
    if (item.deletable === false) {
      return;
    }
    this.deleteClick.emit(item);
  }
}
