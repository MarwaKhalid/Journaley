import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Dropdown, DropdownOption } from '../../components/dropdown/dropdown';
import { IconTextButton } from '../../components/buttons/icon-text-button/icon-text-button';
import { InfoCard } from '../../components/info-card/info-card';
import {
  SectionList,
  SectionListItem,
} from '../../components/section-list/section-list';
import { InputField } from '../../components/input-field/input-field';
import { SearchField } from '../../components/search-field/search-field';
import { TabBar } from '../../components/tab-bar/tab-bar';

export interface SketchbookEntry {
  title: string;
  address: string;
  review: string;
  rating: number;
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
  cityItems: SectionListItem[] = [
    { id: 'all', label: 'All cities', deletable: false },
    { id: 'tokyo', label: 'Tokyo' },
    { id: 'osaka', label: 'Osaka' },
  ];

  activeCategory = 'Restaurants';
  selectedCity = 'Tokyo';
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
      title: 'Neotokyo',
      address: '2-14-3 Shibuya, Tokyo',
      review: 'Incredible late-night ramen — smoky broth and perfect noodles.',
      rating: 5,
    },
    {
      title: 'Sakura Sushi',
      address: '5-1 Ginza, Tokyo',
      review: 'Fresh omakase with a quiet, intimate counter experience.',
      rating: 5,
    },
  ];

  get isPersonalView(): boolean {
    return this.activeCategory === 'Personal';
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
    this.selectedCity = item.label;
  }

  onAddCity(): void {
    console.log('Add city');
  }

  onDeleteCity(item: SectionListItem): void {
    this.cityItems = this.cityItems.filter((c) => c.id !== item.id);
  }

  onAddEntry(): void {
    console.log('Add entry');
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
