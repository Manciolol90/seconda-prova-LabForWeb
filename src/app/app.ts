import { Component, signal } from '@angular/core';
import { Footer } from './components/footer/footer';
import { SliderComponent } from './components/slider/slider';
import { Header } from './components/header/header';
import { HeroBanner } from './components/hero-banner/hero-banner';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [Footer, Header, SliderComponent, HeroBanner, RouterModule],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('seconda-prova');
}
