import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from '../core/components/header/header';
import { Footer } from '../core/components/footer/footer';
import { FormsModule } from '@angular/forms';
import { ViewChild } from '@angular/core';
import { HomePage } from '../pages/home-page/home-page';
import { Library } from '../pages/library/library';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, Header, Footer, FormsModule],
  templateUrl: './main-layout.html',
  styleUrls: ['./main-layout.scss'],
})
export class MainLayout {
  filtro: string = '';

  constructor() {}

  @ViewChild(RouterOutlet) outlet!: RouterOutlet;

  aggiornaFiltro(termine: string) {
    const component = this.outlet.component;

    if (component instanceof HomePage || component instanceof Library) {
      component.filtra(termine);
    }
  }
}
