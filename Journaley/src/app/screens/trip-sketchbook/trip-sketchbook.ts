import { Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map } from 'rxjs/operators';
import { Dropdown, DropdownOption } from '../../components/dropdown/dropdown';
import { IconTextButton } from '../../components/buttons/icon-text-button/icon-text-button';
import {
  InfoCard,
  SketchbookEntryActivity,
} from '../../components/info-card/info-card';
import {
  SectionList,
  SectionListItem,
} from '../../components/section-list/section-list';
import { InputField } from '../../components/input-field/input-field';
import { SearchField } from '../../components/search-field/search-field';
import { TabBar } from '../../components/tab-bar/tab-bar';

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

  cityItems: SectionListItem[] = [
    { id: 'all', label: 'All cities', deletable: false },
    { id: 'tokyo', label: 'Tokyo' },
    { id: 'osaka', label: 'Osaka' },
  ];

  activeCategory = 'Restaurants';
  selectedCityId = 'all';
  selectedCity = 'All cities';
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

  get isPersonalView(): boolean {
    return this.activeCategory === 'Personal';
  }

  private applyTripContextFromRoute(): void {
    const st = history.state as { tripName?: string };
    if (typeof st?.tripName === 'string' && st.tripName.trim()) {
      this.tripDisplayName = st.tripName.trim();
      return;
    }
    this.tripDisplayName = this.tripId ? this.titleCaseFromTripId(this.tripId) : '';
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
  }

  onAddEntry(): void {
    const cityId =
      this.selectedCityId === 'all' ? 'tokyo' : this.selectedCityId;
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

  onEntryActivityChange(
    entry: SketchbookEntry,
    category: SketchbookEntryActivity,
  ): void {
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
}
