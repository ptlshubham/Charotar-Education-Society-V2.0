import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CentenaryHero } from '../centenary-hero/centenary-hero';
import { CentenaryIntro } from '../centenary-intro/centenary-intro';
import { CelebrityGallery } from '../celebrity-gallery/celebrity-gallery';
import { CentenaryJourney } from '../centenary-journey/centenary-journey';
import { GuinnessRecord } from '../guinness-record/guinness-record';
import { CommunityVoices } from '../community-voices/community-voices';
import { AdmissionsCta } from '../../../shared/admissions-cta/admissions-cta';

@Component({
  selector: 'app-index',
  imports: [
    CentenaryHero,
    CentenaryIntro,
    CelebrityGallery,
    CentenaryJourney,
    GuinnessRecord,
    CommunityVoices,
    AdmissionsCta,
  ],
  templateUrl: './index.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './index.scss',
})
export class Index {}
