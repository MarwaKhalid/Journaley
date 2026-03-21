import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconTextButton } from './icon-text-button';

describe('IconTextButton', () => {
  let component: IconTextButton;
  let fixture: ComponentFixture<IconTextButton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconTextButton],
    }).compileComponents();

    fixture = TestBed.createComponent(IconTextButton);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
