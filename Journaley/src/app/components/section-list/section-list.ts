import { Component, EventEmitter, Input, Output } from '@angular/core';

export interface SectionListItem {
  id: string;
  label: string;
  /** When false, no delete icon (e.g. “All cities”). Omit or true for deletable rows. */
  deletable?: boolean;
}

@Component({
  selector: 'app-section-list',
  imports: [],
  templateUrl: './section-list.html',
  styleUrl: './section-list.css',
})
export class SectionList {
  @Input({ required: true }) title!: string;
  @Input() items: SectionListItem[] = [];
  @Output() addClick = new EventEmitter<void>();
  @Output() deleteClick = new EventEmitter<SectionListItem>();

  onAdd(): void {
    this.addClick.emit();
  }

  onDelete(item: SectionListItem): void {
    if (item.deletable === false) {
      return;
    }
    this.deleteClick.emit(item);
  }
}
