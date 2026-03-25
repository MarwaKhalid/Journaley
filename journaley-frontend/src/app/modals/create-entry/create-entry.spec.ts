import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateEntry } from './create-entry';

describe('CreateEntry', () => {
  let component: CreateEntry;
  let fixture: ComponentFixture<CreateEntry>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateEntry],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateEntry);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
