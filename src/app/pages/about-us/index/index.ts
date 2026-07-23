import { Component, ChangeDetectionStrategy } from '@angular/core';
import { AboutHero } from '../about-hero/about-hero';
import { WhoWeAre } from '../who-we-are/who-we-are';
import { Journey } from '../journey/journey';
import { Presence } from '../presence/presence';
import { Messages } from '../messages/messages';
import { CoreValues } from '../core-values/core-values';
import { Gallery } from '../gallery/gallery';
import { FreedomFight } from '../freedom-fight/freedom-fight';
import { AdmissionsCta } from '../../../shared/admissions-cta/admissions-cta';

@Component({
  selector: 'app-index',
  imports: [
    AboutHero,
    WhoWeAre,
    Journey,
    Presence,
    Messages,
    CoreValues,
    Gallery,
    FreedomFight,
    AdmissionsCta,
  ],
  templateUrl: './index.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './index.scss',
})
export class Index {}
