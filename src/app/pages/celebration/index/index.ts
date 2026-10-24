import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CentenaryHero } from '../centenary-hero/centenary-hero';
import { CentenaryIntro } from '../centenary-intro/centenary-intro';
import { CentenaryJourney } from '../centenary-journey/centenary-journey';
import { GuinnessRecord } from '../guinness-record/guinness-record';
import { CentenaryGuests } from '../centenary-guests/centenary-guests';
import { CelebrityGallery } from '../celebrity-gallery/celebrity-gallery';
import { CommunityVoices } from '../community-voices/community-voices';
import { CentenaryLegacy } from '../centenary-legacy/centenary-legacy';

/** The Celebration page: the centenary told in order, ending on the Society today (footer from the layout). */
@Component({
  selector: 'app-celebration-index',
  imports: [
    CentenaryHero,
    CentenaryIntro,
    CentenaryJourney,
    GuinnessRecord,
    CentenaryGuests,
    CelebrityGallery,
    CommunityVoices,
    CentenaryLegacy,
  ],
  templateUrl: './index.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './index.scss',
})
export class Index {}
