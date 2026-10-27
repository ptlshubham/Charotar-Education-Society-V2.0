import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { ProgrammeCard } from '../../../shared/programme-card/programme-card';
import { TabBar } from '../../../shared/tab-bar/tab-bar';
import { FOCUS_LABEL, PROJECTS, PROJECT_KIND, ProjectFocus } from '../../../shared/projects';

type Focus = 'all' | ProjectFocus;

@Component({
  selector: 'app-project-list',
  imports: [ProgrammeCard, TabBar],
  templateUrl: './project-list.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './project-list.scss',
})
export class ProjectList {
  readonly kind = PROJECT_KIND;

  readonly filters: ReadonlyArray<{ id: Focus; label: string; icon: string }> = [
    { id: 'all', label: 'All Projects', icon: 'grid_view' },
    { id: 'education', label: FOCUS_LABEL.education, icon: 'school' },
    { id: 'technology', label: FOCUS_LABEL.technology, icon: 'light_mode' },
    { id: 'sports', label: FOCUS_LABEL.sports, icon: 'sports_cricket' },
    { id: 'environment', label: FOCUS_LABEL.environment, icon: 'eco' },
    { id: 'health', label: FOCUS_LABEL.health, icon: 'favorite' },
    { id: 'skill', label: FOCUS_LABEL.skill, icon: 'schedule' },
    { id: 'arts', label: FOCUS_LABEL.arts, icon: 'palette' },
  ];

  readonly active = signal<Focus>('all');

  select(id: Focus): void {
    this.active.set(id);
  }

  readonly visible = computed(() => {
    const focus = this.active();
    return focus === 'all' ? PROJECTS : PROJECTS.filter((p) => p.focus === focus);
  });
}
