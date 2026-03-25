import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { CarouselModule } from 'primeng/carousel';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { ImgCard } from '../../components/img-card/img-card';
import { SearchField } from '../../components/search-field/search-field';
import { IconTextButton } from '../../components/buttons/icon-text-button/icon-text-button';
import { AuthService } from '../../core/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { CreateCountry } from '../../modals/create-country/create-country';
import { DeleteCountry } from '../../modals/delete-country/delete-country';
import { EditCountry } from '../../modals/edit-country/edit-country';

interface Country {
  name: string;
  filename: string;
  /** URL segment for `/trip-highlights/:countryKey`. */
  slug: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    CarouselModule,
    ButtonModule,
    TagModule,
    ImgCard,
    SearchField,
    IconTextButton,
  ],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  private readonly router = inject(Router);
  private readonly auth = inject(AuthService);
  readonly dialog = inject(MatDialog);

  logout(): void {
    this.auth.logout();
    void this.router.navigateByUrl('/login');
  }

  openCreateCountryDialog() {
    const dialogRef = this.dialog.open(CreateCountry);

    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.name) {
        let filename = 'default.png';

        if (result.file) {
          filename = `${result.name}.${result.file.name.split('.').pop()}`;
        }

        this.countries.update((current) => [
          ...current,
          {
            name: result.name,
            filename: filename,
            slug: result.name.toLowerCase().replace(/\s+/g, '-'),
          },
        ]);
      }
    });
  }

  openEditCountryDialog(country: Country) {
    const dialogRef = this.dialog.open(EditCountry, {
      data: country,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.countries.update((current) =>
          current.map((c) =>
            c.name === country.name
              ? { ...c, name: result, slug: result.toLowerCase().replace(/\s+/g, '-') }
              : c,
          ),
        );
      }
    });
  }

  openDeleteCountryDialog(country: Country) {
    const dialogRef = this.dialog.open(DeleteCountry, {
      data: country,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.countries.update((current) => current.filter((c) => c.name !== country.name));
      }
    });
  }

  searchQuery = '';
  countries = signal<Country[]>([]);
  /** Countries shown in the carousel after search. */
  visibleCountries = computed(() => {
    const q = this.searchQuery.trim().toLowerCase();
    const all = this.countries();
    if (!q) {
      return all;
    }
    return all.filter((c) => c.name.toLowerCase().includes(q));
  });
  responsiveOptions: any[] = [];

  ngOnInit() {
    this.countries.set([
      { name: 'Japan', filename: 'Japan.png', slug: 'japan' },
      { name: 'USA', filename: 'USA.png', slug: 'usa' },
      { name: 'Italy', filename: 'Italy.png', slug: 'italy' },
      { name: 'Brazil', filename: 'Brazil.png', slug: 'brazil' },
      { name: 'France', filename: 'France.png', slug: 'france' },
    ]);
    this.responsiveOptions = [
      { breakpoint: '1400px', numVisible: 3, numScroll: 1 },
      { breakpoint: '1199px', numVisible: 2, numScroll: 1 },
      { breakpoint: '767px', numVisible: 1, numScroll: 1 },
      { breakpoint: '575px', numVisible: 1, numScroll: 1 },
    ];
  }

  openCountryTrips(country: Country): void {
    this.router.navigate(['/trip-highlights', country.slug]);
  }
}
