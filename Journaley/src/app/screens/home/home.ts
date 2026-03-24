import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarouselModule } from 'primeng/carousel';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { ImgCard } from '../../components/img-card/img-card';
import { SearchField } from '../../components/search-field/search-field';
import { IconTextButton } from '../../components/buttons/icon-text-button/icon-text-button';

interface Country {
  name: string;
  filename: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
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
  searchQuery = '';
  countries = signal<Country[]>([]);
  responsiveOptions: any[] = [];

  ngOnInit() {
    this.countries.set([
      { name: 'Japan', filename: 'Japan.png' },
      { name: 'USA', filename: 'USA.png' },
      { name: 'Italy', filename: 'Italy.png' },
      { name: 'Brazil', filename: 'Brazil.png' },
      { name: 'France', filename: 'France.png' },
    ]);
    this.responsiveOptions = [
      { breakpoint: '1400px', numVisible: 3, numScroll: 1 },
      { breakpoint: '1199px', numVisible: 2, numScroll: 1 },
      { breakpoint: '767px', numVisible: 1, numScroll: 1 },
      { breakpoint: '575px', numVisible: 1, numScroll: 1 },
    ];
  }
}
