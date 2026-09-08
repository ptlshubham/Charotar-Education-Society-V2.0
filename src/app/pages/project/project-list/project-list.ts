import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { PLACEHOLDER } from '../../../shared/placeholder-images';

type Focus = 'all' | 'education' | 'technology' | 'community' | 'environment' | 'health' | 'skill';

interface Project {
  title: string;
  desc: string;
  focus: Exclude<Focus, 'all'>;
  image: string;
  path: string[];
}

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './project-list.scss',
})
export class ProjectList {
  readonly filters: ReadonlyArray<{ id: Focus; label: string; icon: string }> = [
    { id: 'all', label: 'All Projects', icon: 'grid_view' },
    { id: 'education', label: 'Education', icon: 'school' },
    { id: 'technology', label: 'Technology', icon: 'light_mode' },
    { id: 'community', label: 'Community', icon: 'group' },
    { id: 'environment', label: 'Environment', icon: 'eco' },
    { id: 'health', label: 'Health', icon: 'favorite' },
    { id: 'skill', label: 'Skill Development', icon: 'schedule' },
  ];

  readonly active = signal<Focus>('all');

  select(id: Focus): void {
    this.active.set(id);
  }

  readonly projects: readonly Project[] = [
    {
      title: 'Project ADITYA',
      desc: 'Promoting renewable energy and sustainability through solar power initiatives across our campuses.',
      focus: 'environment',
      image: PLACEHOLDER.projects.cards[0],
      path: ['M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10z', 'M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4'],
    },
    {
      title: 'Project EKLAVYA',
      desc: 'Empowering students with digital learning, smart classrooms and technology-driven education.',
      focus: 'education',
      image: PLACEHOLDER.projects.cards[1],
      path: ['M4 19.5A2.5 2.5 0 0 1 6.5 17H20', 'M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z'],
    },
    {
      title: 'Project E-GYAN',
      desc: 'Enhancing digital literacy and computer education to prepare students for the future.',
      focus: 'technology',
      image: PLACEHOLDER.projects.cards[2],
      path: ['M2 4a1 1 0 0 1 1-1h18a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1z', 'M8 21h8M12 17v4'],
    },
    {
      title: 'Project SETU',
      desc: 'Creating a bridge between academia and industry for innovation, training and placements.',
      focus: 'skill',
      image: PLACEHOLDER.projects.cards[3],
      path: ['M12 3v6M6 21v-6a6 6 0 0 1 12 0v6', 'M4 21h16', 'M12 9a2 2 0 1 0 0-4 2 2 0 0 0 0 4z'],
    },
    {
      title: 'Project SANGAM',
      desc: 'Bringing communities together through cultural, social and environmental initiatives.',
      focus: 'community',
      image: PLACEHOLDER.projects.cards[4],
      path: ['M17 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2', 'M9.5 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z', 'M22 11h-6'],
    },
    {
      title: 'Project ARJUN',
      desc: 'Promoting health and hygiene through regular medical camps and awareness programs.',
      focus: 'health',
      image: PLACEHOLDER.projects.cards[5],
      path: ['M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z', 'M12 8v8M8 12h8'],
    },
    {
      title: 'Project ANANDAM',
      desc: 'Encouraging mental wellness and stress management through yoga and counselling programs.',
      focus: 'health',
      image: PLACEHOLDER.projects.cards[6],
      path: ['M12 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6z', 'M12 8v6', 'M6 22c0-4 2.7-6 6-6s6 2 6 6', 'M4 13h4M16 13h4'],
    },
    {
      title: 'Project Shivani Foundation',
      desc: 'Supporting underprivileged children with education, healthcare and essential resources.',
      focus: 'community',
      image: PLACEHOLDER.projects.cards[7],
      path: ['M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2', 'M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z', 'M22 21v-2a4 4 0 0 0-3-3.87'],
    },
  ];

  readonly visible = computed(() => {
    const focus = this.active();
    return focus === 'all' ? this.projects : this.projects.filter((p) => p.focus === focus);
  });
}
