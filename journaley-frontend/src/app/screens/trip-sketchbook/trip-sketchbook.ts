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

export interface SketchbookEntry {
  id: string;
  title: string;
  address: string;
  review: string;
  rating: number;
  /** Matches sidebar city row id (e.g. tokyo, osaka). */
  cityId: string;
  /** Tab where the entry was created: Restaurants, Notes, or Activities. */
  category: SketchbookEntryActivity;
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
  tripId = '';
  /** Shown under the page title when known (router state from highlights, or derived from id). */
  tripDisplayName = '';
  /** From trip-highlights navigation state; used so Back returns to the same country filter. */
  highlightsCountryKey = '';
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly router = inject(Router);
  private readonly auth = inject(AuthService);
  readonly dialog = inject(MatDialog);

  logout(): void {
    this.auth.logout();
    void this.router.navigateByUrl('/login');
  }

  cityItems: SectionListItem[] = [
    { id: 'tokyo', label: 'Tokyo' },
    { id: 'osaka', label: 'Osaka' },
  ];

  activeCategory = 'Restaurants';
  selectedCityId = this.cityItems[0]?.id ?? '';
  selectedCity = this.cityItems[0]?.label ?? '';
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

  entries: SketchbookEntry[] = [
    {
      id: 'e1',
      title: 'Neotokyo',
      address: '2-14-3 Shibuya, Tokyo',
      review: 'Incredible late-night ramen — smoky broth and perfect noodles.',
      rating: 5,
      cityId: 'tokyo',
      category: 'Restaurants',
    },
    {
      id: 'e2',
      title: 'Sakura Sushi',
      address: '5-1 Ginza, Tokyo',
      review: 'Fresh omakase with a quiet, intimate counter experience.',
      rating: 5,
      cityId: 'tokyo',
      category: 'Restaurants',
    },
    {
      id: 'e3',
      title: 'Shinkansen notes',
      address: 'Tokyo → Osaka',
      review: 'Grab an ekiben before boarding — window seat on the mountain side.',
      rating: 4,
      cityId: 'osaka',
      category: 'Notes',
    },
    {
      id: 'e4',
      title: 'TeamLab Planets',
      address: 'Toyosu, Tokyo',
      review: 'Wading through digital installations — book a week ahead.',
      rating: 5,
      cityId: 'tokyo',
      category: 'Activities',
    },
  ];

  constructor() {
    const route = inject(ActivatedRoute);
    route.paramMap
      .pipe(
        takeUntilDestroyed(),
        map((pm) => pm.get('tripId') ?? ''),
      )
      .subscribe((id) => {
        this.tripId = id;
        this.applyTripContextFromRoute();
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
    const st = history.state as { tripName?: string; countryKey?: string };
    if (typeof st?.tripName === 'string' && st.tripName.trim()) {
      this.tripDisplayName = st.tripName.trim();
    } else {
      this.tripDisplayName = this.tripId ? this.titleCaseFromTripId(this.tripId) : '';
    }
    const key = st?.countryKey;
    this.highlightsCountryKey =
      typeof key === 'string' && key.trim() ? key.trim().toLowerCase() : '';
  }

  /** Fallback label when navigation state does not include `tripName` (e.g. refresh). */
  private titleCaseFromTripId(id: string): string {
    return id
      .split(/[-_]/)
      .filter(Boolean)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(' ');
  }

  /** Entries for the current tab + city + search/rating/sort. */
  get filteredEntries(): SketchbookEntry[] {
    if (this.isPersonalView) {
      return [];
    }
    let list = this.entries.filter((e) => e.category === this.activeCategory);
    if (this.selectedCityId !== 'all') {
      list = list.filter((e) => e.cityId === this.selectedCityId);
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

  cityLabelForEntry(cityId: string): string {
    return this.cityItems.find((c) => c.id === cityId)?.label ?? cityId;
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
  }

  onAddCity(): void {
    console.log('Add city');
  }

  onDeleteCity(item: SectionListItem): void {
    this.cityItems = this.cityItems.filter((c) => c.id !== item.id);
    if (this.selectedCityId === item.id) {
      const next = this.cityItems[0];
      this.selectedCityId = next?.id ?? '';
      this.selectedCity = next?.label ?? '';
    }
  }

  onAddEntry(): void {
    const cityId = this.selectedCityId || this.cityItems[0]?.id || 'tokyo';
    const tab = this.activeCategory;
    if (tab !== 'Restaurants' && tab !== 'Notes' && tab !== 'Activities') {
      return;
    }
    const next: SketchbookEntry = {
      id:
        typeof crypto !== 'undefined' && crypto.randomUUID
          ? crypto.randomUUID()
          : `e-${Date.now()}`,
      title: 'New entry',
      address: '',
      review: '',
      rating: 5,
      cityId,
      category: tab,
    };
    this.entries = [...this.entries, next];
  }

  onEntryActivityChange(entry: SketchbookEntry, category: SketchbookEntryActivity): void {
    entry.category = category;
  }

  onEditReflection(): void {
    this.reflectionEditing = true;
  }

  onSaveReflection(): void {
    console.log('Save reflection', {
      overall: this.reflectionOverall,
      favorite: this.reflectionFavorite,
      loved: this.reflectionLoved,
      takeaway: this.reflectionTakeaway,
      goBack: this.reflectionGoBack,
    });
    this.reflectionEditing = false;
  }

  onEditEntry(entry: SketchbookEntry): void {
    console.log('Edit', entry.title);
  }

  onDeleteEntry(entry: SketchbookEntry): void {
    this.entries = this.entries.filter((e) => e !== entry);
  }

  openCreateCityDialog() {
    const dialogRef = this.dialog.open(CreateCity);

    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.name) {
        setTimeout(() => {
          const id = result.name.toLowerCase().replace(/\s+/g, '-');
          this.cityItems = [...this.cityItems, { id, label: result.name }];
          this.cdr.detectChanges();
        }, 0);
      }
    });
  }

  openDeleteCityDialog(item: SectionListItem) {
    const city = this.cityItems.find((c) => c.id === item.id);
    if (!city) return;

    const dialogRef = this.dialog.open(DeleteCity, {
      data: city,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        setTimeout(() => {
          this.cityItems = this.cityItems.filter((c) => c.id !== item.id);
          if (this.selectedCityId === item.id) {
            const next = this.cityItems[0];
            this.selectedCityId = next?.id ?? '';
            this.selectedCity = next?.label ?? '';
          }
          this.cdr.detectChanges();
        }, 0);
      }
    });
  }

  openCreateEntryDialog(): void {
    const cityId = this.selectedCityId || this.cityItems[0]?.id || 'tokyo';
    const category = this.activeCategory;

    if (category !== 'Restaurants' && category !== 'Notes' && category !== 'Activities') {
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
      if (result && result.title) {
        setTimeout(() => {
          const newEntry: SketchbookEntry = {
            id:
              typeof crypto !== 'undefined' && crypto.randomUUID
                ? crypto.randomUUID()
                : `e-${Date.now()}`,
            title: result.title,
            address: result.address || '',
            review: result.review || '',
            rating: result.rating || 5,
            cityId: result.cityId, // Use the selected city from dialog
            category: category as SketchbookEntryActivity,
          };

          this.entries = [...this.entries, newEntry];
          this.cdr.detectChanges();
        }, 0);
      }
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
      if (result) {
        setTimeout(() => {
          this.entries = this.entries.map((e) => (e.id === entry.id ? { ...e, ...result } : e));
          this.cdr.detectChanges();
        }, 0);
      }
    });
  }

  openDeleteEntryDialog(entry: SketchbookEntry): void {
    const dialogRef = this.dialog.open(DeleteEntry, {
      data: entry,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        setTimeout(() => {
          this.entries = this.entries.filter((e) => e.id !== entry.id);
          this.cdr.detectChanges();
        }, 0);
      }
    });
  }
}
