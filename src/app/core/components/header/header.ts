import { Component, OnDestroy, EventEmitter, Output, OnInit, HostListener } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { LoginDialog } from '../../../shared/components/login-dialog/login-dialog';
import { RegisterDialog } from '../../../shared/components/register-dialog/register-dialog';
import { AuthService } from '../../../services/auth.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SearchDialog } from '../../../shared/components/search-dialog/search-dialog';
import { RouterModule } from '@angular/router';
import { CartDialog } from '../../../shared/components/cart-dialog/cart-dialog';
import { CartService } from '../../../services/cart.service';
import { Movie } from '../../../models/movie.model';
import { MovieDbService } from '../../../services/movie-db.service';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    CommonModule,
    FormsModule,
    RouterModule,
    MatMenuModule,
    MatIconModule,
  ],
  templateUrl: './header.html',
  styleUrls: ['./header.scss'],
})
export class Header implements OnDestroy, OnInit {
  isLoggedIn = false;
  private authSub?: Subscription;
  termine: string = '';
  searchCardOpen = false;
  userName: string | null = null;
  cartMovies: Movie[] = [];

  @Output() cerca = new EventEmitter<string>();

  onKeyPress() {
    this.cerca.emit(this.termine.toLowerCase());
  }

  resetRicerca() {
    this.termine = '';
    this.cerca.emit('');
  }

  constructor(
    private dialog: MatDialog,
    private authService: AuthService,
    private cartService: CartService,
    private movieDbService: MovieDbService
  ) {
    this.authSub = this.authService.isLoggedIn$.subscribe((status: boolean) => {
      this.isLoggedIn = status;
    });
  }

  ngOnInit(): void {
    this.authSub = this.authService.isLoggedIn$.subscribe((status) => {
      this.isLoggedIn = status;

      if (!status) {
        this.cartMovies = [];
        return;
      }

      const userId = this.authService.getUserId();
      if (userId === null) return;

      this.cartService.getCart(userId).subscribe((cart) => {
        if (!cart || cart.movieIds.length === 0) {
          this.cartMovies = [];
          return;
        }

        this.movieDbService.getSavedMovies().subscribe((movies) => {
          this.cartMovies = movies.filter((m) => cart.movieIds.includes(m.tmdbId ?? m.id));
        });
      });
    });
  }

  accediOnClick() {
    const dialogRef = this.dialog.open(LoginDialog, {
      width: '400px',
      maxWidth: '90vw',
    });

    dialogRef.afterClosed().subscribe((user) => {
      if (user === 'register') {
        this.openRegisterDialog();
      } else if (user?.email) {
        this.userName = user.nome;
        this.isLoggedIn = true;
      }
    });
  }

  logoutOnClick() {
    this.authService.logout();
    this.userName = null;
    this.isLoggedIn = false;
  }

  openRegisterDialog() {
    const dialogRef = this.dialog.open(RegisterDialog, { width: '400px' });

    dialogRef.afterClosed().subscribe((result) => {
      if (result?.registeredUser) {
      }
    });
  }

  closeSearchCard() {
    this.searchCardOpen = false;
    this.termine = '';
    this.cerca.emit('');
  }

  openSearchCard() {
    const dialogRef = this.dialog.open(SearchDialog, {
      width: '400px',
    });

    const instance = dialogRef.componentInstance;
    instance.termineChange.subscribe((termine: string) => {
      this.termine = termine;
      this.cerca.emit(termine);
    });
  }

  topleft() {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  }

  openCart() {
    const userId = this.authService.getUserId();
    if (!userId) return;

    this.cartService.getCart(userId).subscribe((cart) => {
      this.movieDbService.getSavedMovies().subscribe((movies) => {
        this.cartMovies = movies.filter((m) => cart.movieIds.includes(m.tmdbId ?? m.id));

        const dialogRef = this.dialog.open(CartDialog, {
          width: '400px',
          data: {
            movies: this.cartMovies,
            onRemove: (movieId: number) => {
              this.cartService.removeMovieFromCart(userId, movieId).subscribe();
            },
          },
        });

        dialogRef.afterClosed().subscribe((result) => {
          if (result === 'purchase') {
            this.cartService.purchaseCart(userId).subscribe();
          }
        });
      });
    });
  }

  updateFlags() {
    const userId = this.authService.getUserId();
    if (!userId) return;

    this.cartService.getCart(userId).subscribe((cart) => {
      if (!cart || cart.movieIds.length === 0) {
        this.cartMovies = [];
        return;
      }

      this.movieDbService.getSavedMovies().subscribe((movies) => {
        this.cartMovies = movies.filter((m) => cart.movieIds.includes(m.tmdbId ?? m.id));
      });
    });
  }
  userMenuOpen = false;

  toggleUserMenu() {
    this.userMenuOpen = !this.userMenuOpen;
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    const target = event.target as HTMLElement;
    if (!target.closest('.user-menu-container')) {
      this.userMenuOpen = false;
    }
  }

  ngOnDestroy(): void {
    this.authSub?.unsubscribe();
  }
}
