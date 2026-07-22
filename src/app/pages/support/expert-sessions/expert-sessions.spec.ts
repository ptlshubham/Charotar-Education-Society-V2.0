import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpertSessions } from './expert-sessions';

describe('ExpertSessions', () => {
  let component: ExpertSessions;
  let fixture: ComponentFixture<ExpertSessions>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpertSessions],
    }).compileComponents();

    fixture = TestBed.createComponent(ExpertSessions);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
