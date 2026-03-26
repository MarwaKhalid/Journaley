import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { map } from 'rxjs/operators';
import {
  TripHighlightPhoto,
  TripHighlightsMain,
} from '../../components/trip-highlights-main/trip-highlights-main';
import { SectionList, SectionListItem } from '../../components/section-list/section-list';
import { CreateTrip } from '../../modals/create-trip/create-trip';
import { DeleteTrip } from '../../modals/delete-trip/delete-trip';
import { API_BASE_URL } from '../../core/api.config';
import { AuthService } from '../../core/auth.service';
import { MatDialog } from '@angular/material/dialog';

interface CountryApiDto {
  id: number;
  name: string;
  slug: string;
  imageUrl: string | null;
}

interface TripApiDto {
  id: number;
  name: string;
  summary: string;
  people: string | null;
  imageUrls?: string[];
}

interface TripRecord {
  id: number;
  name: string;
  summary: string;
  people: string;
  photos: TripHighlightPhoto[];
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
  private readonly auth = inject(AuthService);
  private readonly http = inject(HttpClient);
  readonly dialog = inject(MatDialog);
  private readonly cdr = inject(ChangeDetectorRef);

  logout(): void {
    this.auth.logout();
    void this.router.navigateByUrl('/login');
  }

  /** From URL `trip-highlights/:countryKey`; empty = not supported for API-backed trips. */
  countryKey = '';
  countryId: number | null = null;
  tripsError = '';

  private countries: CountryApiDto[] = [];
  private tripsList: TripRecord[] = [];

  /** Default to first trip when list loads. */
  selectedTripId: number | null = null;

  get selectedTripIdStr(): string | null {
    return this.selectedTripId == null ? null : String(this.selectedTripId);
  }

  constructor() {
    this.route.paramMap
      .pipe(
        takeUntilDestroyed(),
        map((pm) => (pm.get('countryKey') ?? '').toLowerCase().trim()),
      )
      .subscribe((key) => {
        this.countryKey = key;
        this.resolveCountryAndLoadTrips();
      });
  }

  private resolveCountryAndLoadTrips(): void {
    this.tripsError = '';
    this.countryId = null;
    this.tripsList = [];

    if (!this.countryKey) {
      this.tripsError = 'Select a country from Home to view its trips.';
      return;
    }

    this.http.get<CountryApiDto[]>(`${API_BASE_URL}/api/countries`).subscribe({
      next: (rows) => {
        this.countries = rows;
        const match = rows.find((c) => c.slug === this.countryKey);
        if (!match) {
          this.tripsError = `Country '${this.countryKey}' not found.`;
          return;
        }
        this.countryId = match.id;
        this.loadTrips(match.id);
      },
      error: (err: HttpErrorResponse) => {
        this.tripsError = this.parseHttpError(err, 'Could not load countries.');
      },
    });
  }

  private loadTrips(countryId: number): void {
    this.tripsError = '';
    this.http.get<TripApiDto[]>(`${API_BASE_URL}/api/countries/${countryId}/trips`).subscribe({
      next: (rows) => {
        this.tripsList = rows.map((t) => ({
          id: t.id,
          name: t.name,
          summary: t.summary,
          people: t.people ?? '',
          photos: (t.imageUrls ?? []).map((u) => ({ imageSrc: u })),
        }));
        if (this.tripsList.length) {
          if (!this.tripsList.some((t) => t.id === this.selectedTripId)) {
            this.selectedTripId = this.tripsList[0].id;
          }
        } else {
          this.selectedTripId = null;
        }
        this.cdr.detectChanges();
      },
      error: (err: HttpErrorResponse) => {
        this.tripsError = this.parseHttpError(err, 'Could not load trips.');
        this.cdr.detectChanges();
      },
    });
  }

  get trips(): TripRecord[] {
    return this.tripsList;
  }

  get countryLabel(): string {
    const match = this.countries.find((c) => c.slug === this.countryKey);
    return match?.name ?? this.titleCaseSlug(this.countryKey);
  }

  get tripListItems(): SectionListItem[] {
    return this.trips.map((t) => ({
      id: String(t.id),
      label: t.name,
      deletable: true,
    }));
  }

  get canEditTrip(): boolean {
    return !!this.selectedTrip;
  }

  get mainHeading(): string {
    return this.selectedTrip?.name ?? 'Trip highlights';
  }

  get mainBodyText(): string {
    if (this.tripsError) {
      return this.tripsError;
    }
    if (!this.trips.length) {
      return `No trips yet for ${this.countryLabel}. Add one with the + button.`;
    }
    if (!this.selectedTrip) {
      return 'Select a trip from the sidebar to view its highlights.';
    }
    return this.selectedTrip.summary || 'No summary yet.';
  }

  get mainPhotos(): TripHighlightPhoto[] {
    return this.selectedTrip?.photos ?? [];
  }

  get mainTraveledWith(): string {
    return this.selectedTrip?.people ?? '';
  }

  private get selectedTrip(): TripRecord | undefined {
    if (this.selectedTripId == null) return undefined;
    return this.trips.find((t) => t.id === this.selectedTripId);
  }

  onTripRow(item: SectionListItem): void {
    const id = Number(item.id);
    this.selectedTripId = Number.isFinite(id) ? id : null;
  }

  openCreateTripDialog() {
    const dialogRef = this.dialog.open(CreateTrip, {
      data: { countryKey: this.countryKey },
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (!result?.name?.trim()) return;
      if (this.countryId == null) {
        this.tripsError = 'Select a country first.';
        return;
      }

      const payload = {
        name: String(result.name).trim(),
        summary: String(result.summary ?? '').trim() || 'Trip summary',
        people: String(result.people ?? '').trim(),
      };

      this.http
        .post<TripApiDto>(`${API_BASE_URL}/api/countries/${this.countryId}/trips`, payload)
        .subscribe({
          next: (created) => {
            this.selectedTripId = created.id;
            const image1: File | null = result.image1 ?? null;
            const image2: File | null = result.image2 ?? null;
            const image3: File | null = result.image3 ?? null;

            if (image1 || image2 || image3) {
              const form = new FormData();
              if (image1) form.append('file1', image1, image1.name);
              if (image2) form.append('file2', image2, image2.name);
              if (image3) form.append('file3', image3, image3.name);
              this.http
                .post<void>(
                  `${API_BASE_URL}/api/countries/${this.countryId}/trips/${created.id}/images`,
                  form,
                )
                .subscribe({
                  next: () => this.loadTrips(this.countryId!),
                  error: (err: HttpErrorResponse) => {
                    this.tripsError = this.parseHttpError(
                      err,
                      'Trip created but image upload failed.',
                    );
                    this.loadTrips(this.countryId!);
                  },
                });
            } else {
              this.loadTrips(this.countryId!);
            }
          },
          error: (err: HttpErrorResponse) => {
            this.tripsError = this.parseHttpError(err, 'Could not create trip.');
          },
        });
    });
  }

  openDeleteTripDialog(item: SectionListItem) {
    const id = Number(item.id);
    const trip = this.trips.find((t) => t.id === id);
    if (!trip) return;

    const dialogRef = this.dialog.open(DeleteTrip, {
      data: trip,
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (!confirmed || this.countryId == null) return;
      this.http
        .delete<void>(`${API_BASE_URL}/api/countries/${this.countryId}/trips/${trip.id}`)
        .subscribe({
          next: () => {
            if (this.selectedTripId === trip.id) this.selectedTripId = null;
            this.loadTrips(this.countryId!);
            this.cdr.detectChanges();
          },
          error: (err: HttpErrorResponse) => {
            this.tripsError = this.parseHttpError(err, 'Could not delete trip.');
          },
        });
    });
  }

  onEditTrip(): void {
    const id = this.selectedTripId;
    const navState = this.countryKey ? { countryKey: this.countryKey } : {};
    if (id == null || !this.selectedTrip) {
      this.router.navigate(['/trip-sketchbook'], { state: navState });
      return;
    }
    const trip = this.selectedTrip;
    this.router.navigate(['/trip-sketchbook', id], {
      state: { tripName: trip.name, ...navState },
    });
  }

  private titleCaseSlug(slug: string): string {
    return slug
      .split(/[-_]/)
      .filter(Boolean)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(' ');
  }

  private parseHttpError(err: HttpErrorResponse, fallback: string): string {
    const body = err.error as { error?: string; message?: string } | null;
    return body?.error ?? body?.message ?? err.message ?? fallback;
  }
}
