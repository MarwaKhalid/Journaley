import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  TripHighlightPhoto,
  TripHighlightsMain,
} from '../../components/trip-highlights-main/trip-highlights-main';
import {
  SectionList,
  SectionListItem,
} from '../../components/section-list/section-list';

const JAPAN_PHOTOS: TripHighlightPhoto[] = [
  { imageSrc: 'https://picsum.photos/seed/journaley-ramen/400/400', alt: 'Bowl of ramen' },
  { imageSrc: 'https://picsum.photos/seed/journaley-temple/400/400', alt: 'Pagoda at sunset' },
  { imageSrc: 'https://picsum.photos/seed/journaley-beach/400/400', alt: 'Friends on the beach' },
];

const COAST_PHOTOS: TripHighlightPhoto[] = [
  { imageSrc: 'https://picsum.photos/seed/journaley-coast1/400/400', alt: 'Coastal view' },
  { imageSrc: 'https://picsum.photos/seed/journaley-coast2/400/400', alt: 'Boardwalk' },
];

export interface TripRecord {
  id: string;
  /** Sidebar label and default card title. */
  name: string;
  heading: string;
  bodyText: string;
  photos: TripHighlightPhoto[];
  traveledWith: string;
}

@Component({
  selector: 'app-trip-highlights',
  imports: [SectionList, TripHighlightsMain],
  templateUrl: './trip-highlights.html',
  styleUrl: './trip-highlights.css',
})
export class TripHighlights {
  private readonly router = inject(Router);

  private static newTripId(): string {
    return typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID()
      : `trip-${Date.now()}`;
  }

  trips: TripRecord[] = [
    {
      id: 'japan-2024',
      name: 'Japan 2024',
      heading: 'Japan 2024',
      bodyText:
        'Our two-week adventure through Japan was unforgettable, from the neon-lit streets of Tokyo to the serene temples of Kyoto. The trip was perfectly timed for cherry blossom season.',
      photos: JAPAN_PHOTOS,
      traveledWith: 'A, B, C',
    },
    {
      id: 'california-coast',
      name: 'California coast',
      heading: 'California coast',
      bodyText:
        'Highway 1, foggy mornings, and long sunsets — a slow drive with plenty of stops for tacos and tide pools.',
      photos: COAST_PHOTOS,
      traveledWith: 'Sam',
    },
  ];

  /** Sidebar row id; defaults to first trip (see initializer below). */
  selectedTripId = this.trips[0]?.id ?? '';

  get tripListItems(): SectionListItem[] {
    return this.trips.map((t) => ({
      id: t.id,
      label: t.name,
      deletable: true,
    }));
  }

  get mainHeading(): string {
    return this.selectedTrip?.heading ?? 'Trip highlights';
  }

  get mainBodyText(): string {
    if (!this.trips.length) {
      return 'Add a trip with the + button to start your highlights.';
    }
    return (
      this.selectedTrip?.bodyText ??
      'No description yet — use Edit Trip when you hook up your form.'
    );
  }

  get mainPhotos(): TripHighlightPhoto[] {
    return this.selectedTrip?.photos ?? [];
  }

  get mainTraveledWith(): string {
    return this.selectedTrip?.traveledWith ?? '';
  }

  private get selectedTrip(): TripRecord | undefined {
    return this.trips.find((t) => t.id === this.selectedTripId);
  }

  onTripRow(item: SectionListItem): void {
    this.selectedTripId = item.id;
  }

  onAddTrip(): void {
    const suggested = 'New trip';
    const name =
      typeof globalThis.prompt === 'function'
        ? globalThis.prompt('Name this trip', suggested)
        : suggested;
    if (name === null) {
      return;
    }
    const trimmed = name.trim();
    if (!trimmed) {
      return;
    }
    const id = TripHighlights.newTripId();
    this.trips = [
      ...this.trips,
      {
        id,
        name: trimmed,
        heading: trimmed,
        bodyText: 'Add a description for this trip.',
        photos: [],
        traveledWith: '',
      },
    ];
    this.selectedTripId = id;
  }

  onDeleteTrip(item: SectionListItem): void {
    this.trips = this.trips.filter((t) => t.id !== item.id);
    if (this.selectedTripId === item.id) {
      this.selectedTripId = this.trips[0]?.id ?? '';
    }
  }

  onEditTrip(): void {
    const id = this.selectedTripId;
    if (!id || !this.selectedTrip) {
      this.router.navigate(['/trip-sketchbook']);
      return;
    }
    const trip = this.selectedTrip;
    this.router.navigate(['/trip-sketchbook', id], {
      state: { tripName: trip.name },
    });
  }
}
