import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteEntry } from './delete-entry';

describe('DeleteEntry', () => {
  let component: DeleteEntry;
  let fixture: ComponentFixture<DeleteEntry>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteEntry],
    }).compileComponents();

    fixture = TestBed.createComponent(DeleteEntry);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
