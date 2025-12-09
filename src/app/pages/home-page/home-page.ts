import { Component } from '@angular/core';
import { HeroBanner } from '../../shared/components/hero-banner/hero-banner';
import { Slider } from '../../shared/components/slider/slider';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule, HeroBanner, Slider],
  templateUrl: './home-page.html',
  styleUrl: './home-page.scss',
})
export class HomePage {}
