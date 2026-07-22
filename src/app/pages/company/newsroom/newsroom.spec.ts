import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Newsroom } from './newsroom';

describe('Newsroom', () => {
  let component: Newsroom;
  let fixture: ComponentFixture<Newsroom>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Newsroom],
    }).compileComponents();

    fixture = TestBed.createComponent(Newsroom);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
