import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduleDemo } from './schedule-demo';

describe('ScheduleDemo', () => {
  let component: ScheduleDemo;
  let fixture: ComponentFixture<ScheduleDemo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScheduleDemo],
    }).compileComponents();

    fixture = TestBed.createComponent(ScheduleDemo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
