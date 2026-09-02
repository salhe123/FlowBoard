import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { BoardService } from './board.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  readonly board = inject(BoardService);
  private readonly router = inject(Router);

  logout() {
    this.board.logout();
    this.router.navigateByUrl('/login');
  }
}
