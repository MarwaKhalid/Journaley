import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { map } from 'rxjs/operators';
import {
  TripHighlightPhoto,
  TripHighlightsMain,
} from '../../components/trip-highlights-main/trip-highlights-main';
import { SectionList, SectionListItem } from '../../components/section-list/section-list';
import { DeleteTrip } from '../../modals/delete-trip/delete-trip';
import { MatDialog } from '@angular/material/dialog';
import { CreateTrip } from '../../modals/create-trip/create-trip';

const JAPAN_PHOTOS: TripHighlightPhoto[] = [
  { imageSrc: 'https://picsum.photos/seed/journaley-ramen/400/400', alt: 'Bowl of ramen' },
  { imageSrc: 'https://picsum.photos/seed/journaley-temple/400/400', alt: 'Pagoda at sunset' },
  { imageSrc: 'https://picsum.photos/seed/journaley-beach/400/400', alt: 'Friends on the beach' },
];

const COAST_PHOTOS: TripHighlightPhoto[] = [
  { imageSrc: 'https://picsum.photos/seed/journaley-coast1/400/400', alt: 'Coastal view' },
  { imageSrc: 'https://picsum.photos/seed/journaley-coast2/400/400', alt: 'Boardwalk' },
];

const BRAZIL_PHOTOS: TripHighlightPhoto[] = [
  { imageSrc: 'https://picsum.photos/seed/journaley-brazil1/400/400', alt: 'City skyline' },
  { imageSrc: 'https://picsum.photos/seed/journaley-brazil2/400/400', alt: 'Beach' },
];

const ITALY_PHOTOS: TripHighlightPhoto[] = [
  { imageSrc: 'https://picsum.photos/seed/journaley-italy1/400/400', alt: 'Canal view' },
];

const FRANCE_PHOTOS: TripHighlightPhoto[] = [
  { imageSrc: 'https://picsum.photos/seed/journaley-france1/400/400', alt: 'Street café' },
];

export interface TripRecord {
  id: string;
  /** Lowercase slug matching home / route, e.g. japan, brazil. */
  countryKey: string;
  /** Sidebar label and default card title. */
  name: string;
  heading: string;
  bodyText: string;
  photos: TripHighlightPhoto[];
  traveledWith: string;
}

@Component({
  selector: 'app-trip-highlights',
  imports: [SectionList, TripHighlightsMain, RouterLink],
  templateUrl: './trip-highlights.html',
  styleUrl: './trip-highlights.css',
})
export class TripHighlights {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  readonly dialog = inject(MatDialog);
  private readonly cdr = inject(ChangeDetectorRef);

  /** From URL `trip-highlights/:countryKey`; empty = all countries. */
  countryKey = '';

  private static readonly countryLabels: Record<string, string> = {
    japan: 'Japan',
    usa: 'USA',
    italy: 'Italy',
    brazil: 'Brazil',
    france: 'France',
  };

  private static newTripId(): string {
    return typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID()
      : `trip-${Date.now()}`;
  }

  /** All trips (in-memory); filtered by `countryKey` for the sidebar and main panel. */
  private allTrips: TripRecord[] = [
    {
      id: 'japan-2024',
      countryKey: 'japan',
      name: 'Japan 2024',
      heading: 'Japan 2024',
      bodyText:
        'Our two-week adventure through Japan was unforgettable, from the neon-lit streets of Tokyo to the serene temples of Kyoto. The trip was perfectly timed for cherry blossom season.',
      photos: JAPAN_PHOTOS,
      traveledWith: 'A, B, C',
    },
    {
      id: 'japan-kyoto-spring',
      countryKey: 'japan',
      name: 'Kyoto spring weekend',
      heading: 'Kyoto spring weekend',
      bodyText: 'Temples, matcha, and early cherry blossoms in the old capital.',
      photos: JAPAN_PHOTOS.slice(0, 2),
      traveledWith: 'Alex',
    },
    {
      id: 'california-coast',
      countryKey: 'usa',
      name: 'California coast',
      heading: 'California coast',
      bodyText:
        'Highway 1, foggy mornings, and long sunsets — a slow drive with plenty of stops for tacos and tide pools.',
      photos: COAST_PHOTOS,
      traveledWith: 'Sam',
    },
    {
      id: 'brazil-rio',
      countryKey: 'brazil',
      name: 'Rio summer',
      heading: 'Rio summer',
      bodyText: 'Christ the Redeemer, Copacabana sunsets, and feijoada with new friends.',
      photos: BRAZIL_PHOTOS,
      traveledWith: 'Maya, João',
    },
    {
      id: 'brazil-sp',
      countryKey: 'brazil',
      name: 'São Paulo food crawl',
      heading: 'São Paulo food crawl',
      bodyText: 'Markets, pastel de feira, and a lot of coffee in Vila Madalena.',
      photos: BRAZIL_PHOTOS,
      traveledWith: 'Leo',
    },
    {
      id: 'italy-venice',
      countryKey: 'italy',
      name: 'Venice & Verona',
      heading: 'Venice & Verona',
      bodyText: 'Gondolas, cicchetti bars, and an opera night in the arena.',
      photos: ITALY_PHOTOS,
      traveledWith: 'Chris',
    },
    {
      id: 'france-paris',
      countryKey: 'france',
      name: 'Paris long weekend',
      heading: 'Paris long weekend',
      bodyText: 'Museums by day, bistros by night — classic Left Bank wandering.',
      photos: FRANCE_PHOTOS,
      traveledWith: 'Jordan',
    },
  ];

  /** Sidebar row id; synced when route or list changes. */
  selectedTripId = '';

  constructor() {
    this.route.paramMap
      .pipe(
        takeUntilDestroyed(),
        map((pm) => (pm.get('countryKey') ?? '').toLowerCase().trim()),
      )
      .subscribe((key) => {
        this.countryKey = key;
        this.syncSelectionToFilteredTrips();
      });
  }

  get trips(): TripRecord[] {
    if (!this.countryKey) {
      return this.allTrips;
    }
    return this.allTrips.filter((t) => t.countryKey === this.countryKey);
  }

  get countryLabel(): string {
    if (!this.countryKey) {
      return '';
    }
    return TripHighlights.countryLabels[this.countryKey] ?? this.titleCaseSlug(this.countryKey);
  }

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
      if (this.countryKey) {
        return `No trips yet for ${this.countryLabel}. Add one with the + button.`;
      }
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

  private syncSelectionToFilteredTrips(): void {
    const list = this.trips;
    if (!list.some((t) => t.id === this.selectedTripId)) {
      this.selectedTripId = list[0]?.id ?? '';
    }
  }

  private titleCaseSlug(slug: string): string {
    return slug
      .split(/[-_]/)
      .filter(Boolean)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(' ');
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
    const keyForNew =
      this.countryKey ||
      (typeof globalThis.prompt === 'function'
        ? (globalThis.prompt('Country code (e.g. japan, brazil)', 'japan') ?? '')
            .toLowerCase()
            .trim()
        : 'japan');
    this.allTrips = [
      ...this.allTrips,
      {
        id,
        countryKey: keyForNew || 'other',
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
    this.allTrips = this.allTrips.filter((t) => t.id !== item.id);
    if (this.selectedTripId === item.id) {
      this.selectedTripId = this.trips[0]?.id ?? '';
    }
  }

  openCreateTripDialog() {
    const dialogRef = this.dialog.open(CreateTrip, {
      data: { countryKey: this.countryKey },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.name) {
        // Wrap in setTimeout to avoid change detection error
        setTimeout(() => {
          const id = TripHighlights.newTripId();
          const keyForNew = this.countryKey || result.countryKey || 'other';

          this.allTrips = [
            ...this.allTrips,
            {
              id,
              countryKey: keyForNew,
              name: result.name,
              heading: result.name,
              bodyText: result.bodyText || 'Add a description for this trip.',
              photos: result.photos || [],
              traveledWith: result.traveledWith || '',
            },
          ];
          this.selectedTripId = id;
          this.cdr.detectChanges();
        }, 0);
      }
    });
  }

  openDeleteTripDialog(item: SectionListItem) {
    const trip = this.allTrips.find((t) => t.id === item.id);
    if (!trip) return;

    const dialogRef = this.dialog.open(DeleteTrip, {
      data: trip,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        setTimeout(() => {
          this.allTrips = this.allTrips.filter((t) => t.id !== item.id);
          this.syncSelectionToFilteredTrips();
          this.cdr.detectChanges();
        }, 0);
      }
    });
  }

  onEditTrip(): void {
    const id = this.selectedTripId;
    const navState = this.countryKey ? { countryKey: this.countryKey } : {};
    if (!id || !this.selectedTrip) {
      this.router.navigate(['/trip-sketchbook'], { state: navState });
      return;
    }
    const trip = this.selectedTrip;
    this.router.navigate(['/trip-sketchbook', id], {
      state: { tripName: trip.name, ...navState },
    });
  }
}
