import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { ImgCard } from '../../components/img-card/img-card';
import { SearchField } from '../../components/search-field/search-field';
import { IconTextButton } from '../../components/buttons/icon-text-button/icon-text-button';
import { AuthService } from '../../core/auth.service';
import { API_BASE_URL } from '../../core/api.config';
import { MatDialog } from '@angular/material/dialog';
import { CreateCountry } from '../../modals/create-country/create-country';
import { DeleteCountry } from '../../modals/delete-country/delete-country';
import { EditCountry, EditCountryResult } from '../../modals/edit-country/edit-country';
import { NoticeModal } from '../../modals/notice-modal/notice-modal';
import type { Country } from '../../models/country.model';

/** Country row from GET /api/countries */
interface CountryApiDto {
  id: number;
  name: string;
  isoCode: string | null;
  slug: string;
  imageUrl: string | null;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, ImgCard, SearchField, IconTextButton],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  private readonly router = inject(Router);
  private readonly auth = inject(AuthService);
  private readonly http = inject(HttpClient);
  readonly dialog = inject(MatDialog);

  logout(): void {
    this.auth.logout();
    void this.router.navigateByUrl('/login');
  }

  openCreateCountryDialog() {
    const dialogRef = this.dialog.open(CreateCountry);

    dialogRef
      .afterClosed()
      .subscribe((result: { name: string; file?: File | null } | undefined) => {
        if (!result?.name?.trim()) {
          return;
        }
        const name = result.name.trim();
        const file = result.file ?? null;
        this.http.post<CountryApiDto>(`${API_BASE_URL}/api/countries`, { name }).subscribe({
          next: (created) => {
            if (file) {
              this.postCountryImage(
                created.id,
                file,
                () => this.loadCountries(),
                (err) => this.setHttpError(err, 'Country created but image upload failed.'),
              );
            } else {
              this.loadCountries();
            }
          },
          error: (err: HttpErrorResponse) => this.setHttpError(err, 'Could not create country.'),
        });
      });
  }

  openEditCountryDialog(country: Country) {
    const dialogRef = this.dialog.open(EditCountry, {
      data: country,
    });

    dialogRef.afterClosed().subscribe((result: EditCountryResult | undefined) => {
      if (!result?.name?.trim()) {
        return;
      }
      const name = result.name.trim();
      const file = result.file ?? null;
      this.http
        .put<CountryApiDto>(`${API_BASE_URL}/api/countries/${country.id}`, { name })
        .subscribe({
          next: () => {
            if (file) {
              this.postCountryImage(
                country.id,
                file,
                () => this.loadCountries(),
                (err) => this.setHttpError(err, 'Country updated but image upload failed.'),
              );
            } else {
              this.loadCountries();
            }
          },
          error: (err: HttpErrorResponse) => this.setHttpError(err, 'Could not update country.'),
        });
    });
  }

  openDeleteCountryDialog(country: Country) {
    const dialogRef = this.dialog.open(DeleteCountry, {
      data: country,
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (!confirmed) {
        return;
      }
      this.http.delete<void>(`${API_BASE_URL}/api/countries/${country.id}`).subscribe({
        next: () => this.loadCountries(),
        error: (err: HttpErrorResponse) => {
          const message = this.getHttpErrorMessage(err);
          const isBlockedDelete =
            err.status === 409 || message.toLowerCase().includes('delete trips');
          if (isBlockedDelete) {
            this.countriesError.set('');
            this.dialog.open(NoticeModal, {
              data: {
                title: 'Cannot Delete Country',
                message: message || 'Please delete trips first.',
              },
            });
            return;
          }
          this.setHttpError(err, 'Could not delete country.');
        },
      });
    });
  }

  searchQuery = signal('');
  countries = signal<Country[]>([]);
  countriesError = signal('');

  get visibleCountries(): Country[] {
    const q = this.searchQuery().trim().toLowerCase();
    const all = this.countries();
    if (!q) {
      return all;
    }
    return all.filter((c) => c.name.toLowerCase().includes(q));
  }

  ngOnInit() {
    this.loadCountries();
  }

  loadCountries(): void {
    this.countriesError.set('');
    this.http.get<CountryApiDto[]>(`${API_BASE_URL}/api/countries`).subscribe({
      next: (rows) =>
        this.countries.set(
          rows.map((d) => ({
            id: d.id,
            name: d.name,
            slug: d.slug,
            imageUrl: d.imageUrl ?? null,
          })),
        ),
      error: (err: HttpErrorResponse) => this.setHttpError(err, 'Could not load countries.'),
    });
  }

  private postCountryImage(
    countryId: number,
    file: File,
    onSuccess: () => void,
    onError: (err: HttpErrorResponse) => void,
  ): void {
    const formData = new FormData();
    formData.append('file', file, file.name);
    this.http.post<void>(`${API_BASE_URL}/api/countries/${countryId}/image`, formData).subscribe({
      next: () => onSuccess(),
      error: (err: HttpErrorResponse) => onError(err),
    });
  }

  private setHttpError(err: HttpErrorResponse, fallback: string): void {
    this.countriesError.set(this.getHttpErrorMessage(err) || fallback);
  }

  private getHttpErrorMessage(err: HttpErrorResponse): string {
    const body = err.error as { error?: string; message?: string } | null;
    return body?.error ?? body?.message ?? err.message ?? '';
  }

  openCountryTrips(country: Country): void {
    this.router.navigate(['/trip-highlights', country.slug]);
  }
}
