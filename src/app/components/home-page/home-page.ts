import { Component } from '@angular/core';
import { HeroBanner } from '../hero-banner/hero-banner';
import { SliderComponent } from '../slider/slider';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule, HeroBanner, SliderComponent],
  templateUrl: './home-page.html',
  styleUrl: './home-page.scss',
})
export class HomePage {}
