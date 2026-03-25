import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImgCard } from './img-card';

describe('ImgCard', () => {
  let component: ImgCard;
  let fixture: ComponentFixture<ImgCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImgCard],
    }).compileComponents();

    fixture = TestBed.createComponent(ImgCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
