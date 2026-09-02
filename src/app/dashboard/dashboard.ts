import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BoardService } from '../board.service';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  private readonly board = inject(BoardService);

  name = this.board.userName;

  get counts() {
    return this.board.counts();
  }

  reset() {
    if (!confirm('Reset to the original demo projects and tasks?')) {
      return;
    }
    this.board.resetDemo();
  }
}
