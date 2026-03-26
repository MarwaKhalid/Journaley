import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { map } from 'rxjs/operators';
import { Dropdown, DropdownOption } from '../../components/dropdown/dropdown';
import { IconTextButton } from '../../components/buttons/icon-text-button/icon-text-button';
import { InfoCard, SketchbookEntryActivity } from '../../components/info-card/info-card';
import { SectionList, SectionListItem } from '../../components/section-list/section-list';
import { InputField } from '../../components/input-field/input-field';
import { SearchField } from '../../components/search-field/search-field';
import { TabBar } from '../../components/tab-bar/tab-bar';
import { MatDialog } from '@angular/material/dialog';
import { CreateCity } from '../../modals/create-city/create-city';
import { DeleteCity } from '../../modals/delete-city/delete-city';
import { DeleteEntry } from '../../modals/delete-entry/delete-entry';
import { EditEntry } from '../../modals/edit-entry/edit-entry';
import { CreateEntry } from '../../modals/create-entry/create-entry';
import { AuthService } from '../../core/auth.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { API_BASE_URL } from '../../core/api.config';

export interface SketchbookEntry {
  id: number;
  title: string;
  address: string;
  review: string;
  rating: number;
  cityId: number;
  /** Tab where the entry was created: Restaurants, Hotel, or Activities. */
  category: SketchbookEntryActivity;
}

interface CityApiDto {
  id: number;
  name: string;
}

interface EntryApiDto {
  id: number;
  cityId: number;
  title: string;
  address: string | null;
  review: string | null;
  rating: number | null;
  category: string;
}

interface ReflectionsApiDto {
  tripId: number;
  overallFeeling: string | null;
  favoriteMoment: string | null;
  whatILovedMost: string | null;
  whatITookAwayFromTheTrip: string | null;
  wouldIGoBackAndWhy: string | null;
}

interface TripContextApiDto {
  id: number;
  name: string;
  countryId: number;
  countrySlug: string | null;
}

@Component({
  selector: 'app-trip-sketchbook',
  imports: [
    RouterLink,
    SectionList,
    TabBar,
    SearchField,
    Dropdown,
    IconTextButton,
    InfoCard,
    InputField,
  ],
  templateUrl: './trip-sketchbook.html',
  styleUrl: './trip-sketchbook.css',
})
export class TripSketchbook {
  /** From route `/trip-sketchbook/:tripId` (empty when using `/trip-sketchbook` only). */
  tripId: number | null = null;
  countryId: number | null = null;
  /** Shown under the page title when known (router state from highlights, or derived from id). */
  tripDisplayName = '';
  /** From trip-highlights navigation state; used so Back returns to the same country filter. */
  highlightsCountryKey = '';
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly router = inject(Router);
  private readonly auth = inject(AuthService);
  private readonly http = inject(HttpClient);
  readonly dialog = inject(MatDialog);

  loading = false;
  errorMessage = '';
  reflectionsSaveMessage = '';
  private entriesRequestSeq = 0;

  private debugLog(hypothesisId: string, location: string, message: string, data: Record<string, unknown>): void {
    try {
      const payload = {
        sessionId: 'd01587',
        runId: 'pre-fix',
        hypothesisId,
        location,
        message,
        data,
        timestamp: Date.now(),
      };
      const body = JSON.stringify(payload);
      // Prefer sendBeacon to avoid browser CORS blocking.
      if (typeof navigator !== 'undefined' && typeof navigator.sendBeacon === 'function') {
        navigator.sendBeacon(
          'http://127.0.0.1:7571/ingest/a61fe508-f840-482d-8904-efdb04de2399',
          new Blob([body], { type: 'application/json' }),
        );
        return;
      }
      fetch('http://127.0.0.1:7571/ingest/a61fe508-f840-482d-8904-efdb04de2399', {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': 'd01587' },
        body,
      }).catch(() => {});
    } catch {
      // ignore
    }
  }

  logout(): void {
    this.auth.logout();
    void this.router.navigateByUrl('/login');
  }

  cityItems: SectionListItem[] = [];

  activeCategory = 'Restaurants';
  selectedCityId: string | null = null;
  selectedCity = '';
  searchQuery = '';
  ratingFilter = 'all';
  sortFilter = 'name-asc';

  reflectionOverall = '';
  reflectionFavorite = '';
  reflectionLoved = '';
  reflectionTakeaway = '';
  reflectionGoBack = '';

  /** Personal reflection: false = view (read-only), true = editing. */
  reflectionEditing = false;

  readonly ratingOptions: DropdownOption[] = [
    { label: 'All Rating', value: 'all' },
    { label: '5 stars', value: '5' },
    { label: '4+ stars', value: '4' },
  ];

  readonly sortOptions: DropdownOption[] = [
    { label: 'Name (A-Z)', value: 'name-asc' },
    { label: 'Name (Z-A)', value: 'name-desc' },
  ];

  entries: SketchbookEntry[] = [];

  constructor() {
    const route = inject(ActivatedRoute);
    route.paramMap
      .pipe(
        takeUntilDestroyed(),
        map((pm) => pm.get('tripId') ?? ''),
      )
      .subscribe((id) => {
        const num = Number(id);
        this.tripId = Number.isFinite(num) && num > 0 ? num : null;
        this.applyTripContextFromRoute();
        void this.loadAllForTrip();
      });
  }

  get isPersonalView(): boolean {
    return this.activeCategory === 'Personal';
  }

  /** Target for "Back to trip" — same country highlights when we have a `countryKey` from highlights. */
  get highlightsBackLink(): string[] {
    return this.highlightsCountryKey
      ? ['/trip-highlights', this.highlightsCountryKey]
      : ['/trip-highlights'];
  }

  private applyTripContextFromRoute(): void {
    const st = history.state as {
      tripName?: string;
      countryKey?: string;
      countryId?: number;
    };
    if (typeof st?.tripName === 'string' && st.tripName.trim()) {
      this.tripDisplayName = st.tripName.trim();
    } else {
      this.tripDisplayName = this.tripId != null ? `Trip ${this.tripId}` : '';
    }
    const key = st?.countryKey;
    this.highlightsCountryKey =
      typeof key === 'string' && key.trim() ? key.trim().toLowerCase() : '';
    this.countryId = typeof st?.countryId === 'number' && Number.isFinite(st.countryId) ? st.countryId : null;
  }

  /** Entries for the current tab + city + search/rating/sort. */
  get filteredEntries(): SketchbookEntry[] {
    if (this.isPersonalView) {
      return [];
    }
    let list = this.entries.filter((e) => e.category === this.activeCategory);
    const selectedCityNum = this.selectedCityId ? Number(this.selectedCityId) : null;
    if (selectedCityNum != null && Number.isFinite(selectedCityNum)) {
      list = list.filter((e) => e.cityId === selectedCityNum);
    }
    const q = this.searchQuery.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.address.toLowerCase().includes(q) ||
          e.review.toLowerCase().includes(q),
      );
    }
    if (this.ratingFilter === '5') {
      list = list.filter((e) => e.rating === 5);
    } else if (this.ratingFilter === '4') {
      list = list.filter((e) => e.rating >= 4);
    }
    const sort = this.sortFilter;
    return [...list].sort((a, b) => {
      if (sort === 'name-desc') {
        return b.title.localeCompare(a.title);
      }
      return a.title.localeCompare(b.title);
    });
  }

  cityLabelForEntry(cityId: number): string {
    const key = String(cityId);
    return this.cityItems.find((c) => c.id === key)?.label ?? key;
  }

  onCategoryChange(cat: string): void {
    if (this.activeCategory === 'Personal' && cat !== 'Personal') {
      this.reflectionEditing = false;
    }
    this.activeCategory = cat;
    if (cat === 'Personal') {
      this.reflectionEditing = false;
    }
  }

  onCityRow(item: SectionListItem): void {
    this.selectedCityId = item.id;
    this.selectedCity = item.label;
    this.entries = [];
    // #region agent log
    this.debugLog('H2', 'trip-sketchbook.ts:onCityRow', 'City selected', {
      selectedCityId: this.selectedCityId,
      selectedCityLabel: this.selectedCity,
    });
    // #endregion
    void this.loadEntriesForSelectedCity();
  }

  onEditReflection(): void {
    this.reflectionEditing = true;
  }

  onSaveReflection(): void {
    void this.saveReflections();
  }

  openCreateCityDialog() {
    const dialogRef = this.dialog.open(CreateCity);

    dialogRef.afterClosed().subscribe((result) => {
      if (!result?.name || this.tripId == null) return;
      void this.createCity(String(result.name));
    });
  }

  openDeleteCityDialog(item: SectionListItem) {
    const city = this.cityItems.find((c) => c.id === item.id);
    if (!city) return;

    const dialogRef = this.dialog.open(DeleteCity, {
      data: city,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (!result) return;
      const id = Number(item.id);
      if (!Number.isFinite(id)) return;
      void this.deleteCity(id);
    });
  }

  openCreateEntryDialog(): void {
    const cityId = this.selectedCityId ?? this.cityItems[0]?.id ?? null;
    const category = this.activeCategory;

    if (category !== 'Restaurants' && category !== 'Hotel' && category !== 'Activities') {
      return;
    }

    const cityOptions: DropdownOption[] = this.cityItems.map((city) => ({
      label: city.label,
      value: city.id,
    }));

    const dialogRef = this.dialog.open(CreateEntry, {
      data: {
        category,
        cityId,
        cityOptions, // Pass city options
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (!result?.title) return;
      const cityNum = Number(result.cityId);
      if (!Number.isFinite(cityNum)) return;
      void this.createEntry(cityNum, {
        title: String(result.title),
        address: String(result.address ?? ''),
        review: String(result.review ?? ''),
        rating: Number(result.rating ?? 5),
        category: String(result.category ?? category),
      });
    });
  }

  openEditEntryDialog(entry: SketchbookEntry): void {
    const cityOptions: DropdownOption[] = this.cityItems.map((city) => ({
      label: city.label,
      value: city.id,
    }));

    const dialogRef = this.dialog.open(EditEntry, {
      data: {
        ...entry,
        cityOptions, // Pass the city options to the dialog
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (!result) return;
      const cityNum = Number(result.cityId);
      if (!Number.isFinite(cityNum) || this.tripId == null || this.countryId == null) return;
      void this.updateEntry(cityNum, entry.id, {
        title: String(result.title ?? entry.title),
        address: String(result.address ?? entry.address),
        review: String(result.review ?? entry.review),
        rating: Number(result.rating ?? entry.rating),
        category: String(result.category ?? entry.category),
      });
    });
  }

  openDeleteEntryDialog(entry: SketchbookEntry): void {
    const dialogRef = this.dialog.open(DeleteEntry, {
      data: entry,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (!result) return;
      void this.deleteEntry(entry.cityId, entry.id);
    });
  }

  private async loadAllForTrip(): Promise<void> {
    this.errorMessage = '';
    this.reflectionsSaveMessage = '';

    if (this.tripId == null) {
      this.cityItems = [];
      this.entries = [];
      return;
    }

    this.loading = true;
    try {
      if (this.countryId == null) {
        const ctx = await this.http
          .get<TripContextApiDto>(`${API_BASE_URL}/api/trips/${this.tripId}`)
          .toPromise();
        if (ctx) {
          this.countryId = ctx.countryId;
          if (!this.tripDisplayName) this.tripDisplayName = ctx.name;
          if (!this.highlightsCountryKey && ctx.countrySlug) this.highlightsCountryKey = ctx.countrySlug;
        }
      }

      if (this.countryId == null) {
        this.errorMessage = 'Could not resolve country for this trip.';
        return;
      }

      await this.loadCities();
      await this.loadReflections();
      await this.loadEntriesForSelectedCity();
    } catch (e) {
      this.errorMessage = this.parseHttpError(e, 'Could not load sketchbook.');
    } finally {
      this.loading = false;
      this.cdr.detectChanges();
    }
  }

  private async loadCities(): Promise<void> {
    if (this.tripId == null || this.countryId == null) return;
    const cities = await this.http
      .get<CityApiDto[]>(`${API_BASE_URL}/api/countries/${this.countryId}/trips/${this.tripId}/cities`)
      .toPromise();
    const items = (cities ?? []).map((c) => ({ id: String(c.id), label: c.name }));
    this.cityItems = items;

    const stillSelected =
      this.selectedCityId != null && this.cityItems.some((c) => c.id === this.selectedCityId);
    const next = stillSelected ? this.cityItems.find((c) => c.id === this.selectedCityId)! : this.cityItems[0];
    this.selectedCityId = next?.id ?? null;
    this.selectedCity = next?.label ?? '';
  }

  private async loadEntriesForSelectedCity(): Promise<void> {
    if (this.tripId == null || this.countryId == null) return;
    const cityNum = this.selectedCityId ? Number(this.selectedCityId) : null;
    if (cityNum == null || !Number.isFinite(cityNum)) {
      this.entries = [];
      return;
    }

    const seq = ++this.entriesRequestSeq;
    const selectedCityAtRequestStart = this.selectedCityId;

    // #region agent log
    this.debugLog('H2', 'trip-sketchbook.ts:loadEntriesForSelectedCity:start', 'Loading entries for city', {
      tripId: this.tripId,
      countryId: this.countryId,
      selectedCityId: this.selectedCityId,
      cityNum,
      seq,
    });
    // #endregion

    try {
      const entries = await this.http
        .get<EntryApiDto[]>(
          `${API_BASE_URL}/api/countries/${this.countryId}/trips/${this.tripId}/cities/${cityNum}/entries`,
        )
        .toPromise();

      // Ignore out-of-order responses (user clicked cities quickly).
      if (seq !== this.entriesRequestSeq || this.selectedCityId !== selectedCityAtRequestStart) {
        // #region agent log
        this.debugLog('H4', 'trip-sketchbook.ts:loadEntriesForSelectedCity:stale', 'Ignoring stale entries response', {
          seq,
          latestSeq: this.entriesRequestSeq,
          selectedCityAtRequestStart,
          selectedCityIdNow: this.selectedCityId,
          count: Array.isArray(entries) ? entries.length : null,
        });
        // #endregion
        return;
      }

      this.entries = (entries ?? []).map((e) => ({
        id: Number(e.id),
        title: String(e.title ?? ''),
        address: e.address ?? '',
        review: e.review ?? '',
        rating: Number(e.rating ?? 0),
        cityId: Number((e as unknown as { cityId?: unknown }).cityId ?? cityNum),
        category: this.normalizeCategory(e.category),
      }));
      this.cdr.detectChanges();

      // #region agent log
      this.debugLog('H3', 'trip-sketchbook.ts:loadEntriesForSelectedCity:success', 'Entries loaded', {
        cityNum,
        selectedCityId: this.selectedCityId,
        activeCategory: this.activeCategory,
        receivedCount: Array.isArray(entries) ? entries.length : null,
        mappedCount: this.entries.length,
        mappedCityIds: this.entries.slice(0, 10).map((x) => x.cityId),
        mappedCategories: this.entries.slice(0, 10).map((x) => x.category),
      });
      // #endregion
    } catch (e) {
      if (seq !== this.entriesRequestSeq || this.selectedCityId !== selectedCityAtRequestStart) {
        return;
      }
      this.entries = [];
      this.errorMessage = this.parseHttpError(e, 'Could not load entries.');
      this.cdr.detectChanges();

      // #region agent log
      this.debugLog('H2', 'trip-sketchbook.ts:loadEntriesForSelectedCity:error', 'Entries load failed', {
        cityNum,
        selectedCityId: this.selectedCityId,
        errorMessage: this.errorMessage,
      });
      // #endregion
    }
  }

  private normalizeCategory(raw: unknown): SketchbookEntryActivity {
    const v = typeof raw === 'string' ? raw.trim() : '';
    if (v === 'Restaurants' || v === 'Hotel' || v === 'Activities') {
      return v;
    }
    // Back-compat for older data / previous label.
    if (v === 'Notes') {
      return 'Hotel';
    }
    return 'Restaurants';
  }

  private async loadReflections(): Promise<void> {
    if (this.tripId == null || this.countryId == null) return;
    const pr = await this.http
      .get<ReflectionsApiDto | null>(
        `${API_BASE_URL}/api/countries/${this.countryId}/trips/${this.tripId}/reflections`,
      )
      .toPromise();
    this.reflectionOverall = pr?.overallFeeling ?? '';
    this.reflectionFavorite = pr?.favoriteMoment ?? '';
    this.reflectionLoved = pr?.whatILovedMost ?? '';
    this.reflectionTakeaway = pr?.whatITookAwayFromTheTrip ?? '';
    this.reflectionGoBack = pr?.wouldIGoBackAndWhy ?? '';
    this.reflectionEditing = false;
  }

  private async createCity(name: string): Promise<void> {
    if (this.tripId == null || this.countryId == null) return;
    this.errorMessage = '';
    try {
      await this.http
        .post<CityApiDto>(`${API_BASE_URL}/api/countries/${this.countryId}/trips/${this.tripId}/cities`, {
          name,
        })
        .toPromise();
      await this.loadCities();
      this.cdr.detectChanges();
    } catch (e) {
      this.errorMessage = this.parseHttpError(e, 'Could not create city.');
    }
  }

  private async deleteCity(cityId: number): Promise<void> {
    if (this.tripId == null || this.countryId == null) return;
    this.errorMessage = '';
    try {
      await this.http
        .delete<void>(
          `${API_BASE_URL}/api/countries/${this.countryId}/trips/${this.tripId}/cities/${cityId}`,
        )
        .toPromise();
      await this.loadCities();
      await this.loadEntriesForSelectedCity();
      this.cdr.detectChanges();
    } catch (e) {
      this.errorMessage = this.parseHttpError(e, 'Could not delete city.');
    }
  }

  private async createEntry(
    cityId: number,
    payload: { title: string; address: string; review: string; rating: number; category: string },
  ): Promise<void> {
    if (this.tripId == null || this.countryId == null) return;
    this.errorMessage = '';
    try {
      // #region agent log
      this.debugLog('H1', 'trip-sketchbook.ts:createEntry:start', 'Creating entry', {
        tripId: this.tripId,
        countryId: this.countryId,
        cityId,
        selectedCityId: this.selectedCityId,
        payloadSummary: { titleLen: (payload.title ?? '').length, rating: payload.rating, category: payload.category },
      });
      // #endregion
      await this.http
        .post<EntryApiDto>(
          `${API_BASE_URL}/api/countries/${this.countryId}/trips/${this.tripId}/cities/${cityId}/entries`,
          payload,
        )
        .toPromise();
      await this.loadEntriesForSelectedCity();
      this.cdr.detectChanges();

      // #region agent log
      this.debugLog('H1', 'trip-sketchbook.ts:createEntry:afterReload', 'Create entry completed and reloaded', {
        selectedCityId: this.selectedCityId,
        entriesCount: this.entries.length,
        topEntry: this.entries[0] ? { id: this.entries[0].id, cityId: this.entries[0].cityId, category: this.entries[0].category } : null,
      });
      // #endregion
    } catch (e) {
      this.errorMessage = this.parseHttpError(e, 'Could not create entry.');
    }
  }

  private async updateEntry(
    cityId: number,
    entryId: number,
    payload: { title: string; address: string; review: string; rating: number; category: string },
  ): Promise<void> {
    if (this.tripId == null || this.countryId == null) return;
    this.errorMessage = '';
    try {
      await this.http
        .put<EntryApiDto>(
          `${API_BASE_URL}/api/countries/${this.countryId}/trips/${this.tripId}/cities/${cityId}/entries/${entryId}`,
          payload,
        )
        .toPromise();
      await this.loadEntriesForSelectedCity();
      this.cdr.detectChanges();
    } catch (e) {
      this.errorMessage = this.parseHttpError(e, 'Could not update entry.');
    }
  }

  private async deleteEntry(cityId: number, entryId: number): Promise<void> {
    if (this.tripId == null || this.countryId == null) return;
    this.errorMessage = '';
    try {
      await this.http
        .delete<void>(
          `${API_BASE_URL}/api/countries/${this.countryId}/trips/${this.tripId}/cities/${cityId}/entries/${entryId}`,
        )
        .toPromise();
      await this.loadEntriesForSelectedCity();
      this.cdr.detectChanges();
    } catch (e) {
      this.errorMessage = this.parseHttpError(e, 'Could not delete entry.');
    }
  }

  private async saveReflections(): Promise<void> {
    if (this.tripId == null || this.countryId == null) return;
    this.errorMessage = '';
    this.reflectionsSaveMessage = '';
    try {
      await this.http
        .put<ReflectionsApiDto>(`${API_BASE_URL}/api/countries/${this.countryId}/trips/${this.tripId}/reflections`, {
          overallFeeling: this.reflectionOverall,
          favoriteMoment: this.reflectionFavorite,
          whatILovedMost: this.reflectionLoved,
          whatITookAwayFromTheTrip: this.reflectionTakeaway,
          wouldIGoBackAndWhy: this.reflectionGoBack,
        })
        .toPromise();
      this.reflectionEditing = false;
      this.reflectionsSaveMessage = 'Saved.';
      this.cdr.detectChanges();
    } catch (e) {
      this.errorMessage = this.parseHttpError(e, 'Could not save reflections.');
    }
  }

  private parseHttpError(err: unknown, fallback: string): string {
    const httpErr = err as HttpErrorResponse;
    const body = (httpErr?.error ?? null) as { error?: string; message?: string } | null;
    return body?.error ?? body?.message ?? httpErr?.message ?? fallback;
  }
}
