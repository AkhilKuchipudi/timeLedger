import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Timesheets } from './timesheets';

describe('Timesheets', () => {
  let component: Timesheets;
  let fixture: ComponentFixture<Timesheets>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Timesheets]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Timesheets);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
