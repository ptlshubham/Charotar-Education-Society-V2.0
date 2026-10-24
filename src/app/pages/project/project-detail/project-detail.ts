import { ChangeDetectionStrategy, Component, computed, effect, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs';
import { SeoService } from '../../../core/services/seo.service';
import { relatedTo } from '../../../shared/programme';
import { ProgrammePage } from '../../../shared/programme-page/programme-page';
import { FOCUS_LABEL, PROJECTS, PROJECT_KIND, projectBySlug } from '../../../shared/projects';

/** One project's page (/project/aditya, /project/udaan-education, ...). */
@Component({
  selector: 'app-project-detail',
  imports: [ProgrammePage],
  templateUrl: './project-detail.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './project-detail.scss',
})
export class ProjectDetail {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly seo = inject(SeoService);

  readonly kind = PROJECT_KIND;
  readonly focusLabel = FOCUS_LABEL;

  private readonly slug = toSignal(this.route.paramMap.pipe(map((p) => p.get('slug'))), {
    initialValue: this.route.snapshot.paramMap.get('slug'),
  });

  readonly project = computed(() => projectBySlug(this.slug()));

  /** Three more, with the same focus first. */
  readonly more = computed(() => {
    const project = this.project();
    return project ? relatedTo(PROJECTS, project, (p) => p.focus) : [];
  });

  constructor() {
    effect(() => {
      const project = this.project();
      if (!project) {
        this.router.navigateByUrl('/project');
        return;
      }
      this.seo.applyCustom(
        {
          title: project.title,
          description: project.desc,
          image: project.heroImage ?? project.image,
          url: `/project/${project.slug}`,
        },
        'project',
      );
    });
  }
}
