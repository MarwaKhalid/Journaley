import { Component } from '@angular/core';
import { TripHighlightsMain } from '../../components/trip-highlights-main/trip-highlights-main';
import {
  SectionList,
  SectionListItem,
} from '../../components/section-list/section-list';

@Component({
  selector: 'app-trip-highlights',
  imports: [SectionList, TripHighlightsMain],
  templateUrl: './trip-highlights.html',
  styleUrl: './trip-highlights.css',
})
export class TripHighlights {
  tripListItems: SectionListItem[] = [
    { id: 'all', label: 'All cities', deletable: false },
    { id: 'tokyo', label: 'Tokyo' },
    { id: 'osaka', label: 'Osaka' },
  ];

  onAddTrip(): void {
    console.log('Add trip');
  }

  onDeleteTrip(item: SectionListItem): void {
    this.tripListItems = this.tripListItems.filter((row) => row.id !== item.id);
  }

  onEditTrip(): void {
    console.log('Edit trip');
  }
}
