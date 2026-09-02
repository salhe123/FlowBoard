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
  password = '';
  message = signal('');
  x = 0;
  y = 0;
  dragging = false;
  private startX = 0;
  private startY = 0;
  private originX = 0;
  private originY = 0;

  pointerDown(event: PointerEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.grip')) {
      return;
    }

    event.preventDefault();
    this.dragging = true;
    this.startX = event.clientX;
    this.startY = event.clientY;
    this.originX = this.x;
    this.originY = this.y;
    (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
  }

  pointerMove(event: PointerEvent) {
    if (!this.dragging) {
      return;
    }

    this.x = this.originX + (event.clientX - this.startX);
    this.y = this.originY + (event.clientY - this.startY);
  }

  pointerUp(event: PointerEvent) {
    if (!this.dragging) {
      return;
    }

    this.dragging = false;
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    const pad = 12;
    if (rect.left < pad) {
      this.x += pad - rect.left;
    }
    if (rect.top < pad) {
      this.y += pad - rect.top;
    }
    if (rect.right > window.innerWidth - pad) {
      this.x += window.innerWidth - pad - rect.right;
    }
    if (rect.bottom > window.innerHeight - pad) {
      this.y += window.innerHeight - pad - rect.bottom;
    }
  }

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
