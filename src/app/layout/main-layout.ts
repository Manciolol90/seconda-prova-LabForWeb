import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from '../core/components/header/header';
import { Footer } from '../core/components/footer/footer';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, Header, Footer],
  templateUrl: './main-layout.html',
  styleUrls: ['./main-layout.scss'],
})
export class MainLayout {}
