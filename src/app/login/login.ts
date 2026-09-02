import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BoardService } from '../board.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private readonly board = inject(BoardService);
  private readonly router = inject(Router);

  name = '';
  message = signal('');

  submit() {
    const user = this.name.trim();
    if (!user) {
      this.message.set('Type a name first.');
      return;
    }

    this.board.login(user);
    this.router.navigateByUrl('/dashboard');
  }
}
