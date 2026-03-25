import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';

import { API_BASE_URL } from '../../core/api.config';
import { Home } from './home';

describe('Home', () => {
  let component: Home;
  let fixture: ComponentFixture<Home>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Home],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(Home);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load countries from API on init', async () => {
    fixture.detectChanges();
    const req = httpMock.expectOne(`${API_BASE_URL}/api/countries`);
    expect(req.request.method).toBe('GET');
    req.flush([
      {
        id: 1,
        name: 'Japan',
        isoCode: null,
        slug: 'japan',
        imageFilename: 'default.png',
        createdAt: '2025-01-01T00:00:00',
        updatedAt: '2025-01-01T00:00:00',
      },
    ]);
    await fixture.whenStable();
    expect(component.countries().length).toBe(1);
    expect(component.countries()[0].slug).toBe('japan');
    httpMock.verify();
  });
});
