import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataDeletion } from './data-deletion';

describe('DataDeletion', () => {
  let component: DataDeletion;
  let fixture: ComponentFixture<DataDeletion>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DataDeletion],
    }).compileComponents();

    fixture = TestBed.createComponent(DataDeletion);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
