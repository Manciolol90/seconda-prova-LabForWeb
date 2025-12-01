import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Footer } from './components/footer/footer';
import { Slider } from './components/slider/slider';
import { Header } from './components/header/header';
import { HeroBanner } from './components/hero-banner/hero-banner';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Footer, Header, Slider, HeroBanner],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('seconda-prova');
}
