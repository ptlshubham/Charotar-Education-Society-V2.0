import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectMangement } from './project-mangement';

describe('ProjectMangement', () => {
  let component: ProjectMangement;
  let fixture: ComponentFixture<ProjectMangement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectMangement],
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectMangement);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
