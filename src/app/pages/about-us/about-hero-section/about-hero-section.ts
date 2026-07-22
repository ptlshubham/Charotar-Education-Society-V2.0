import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-about-hero-section',
  imports: [RouterLink],
  templateUrl: './about-hero-section.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './about-hero-section.scss',
})
export class AboutHeroSection {}
