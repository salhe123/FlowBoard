import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { BoardService } from './board.service';

export const authGuard: CanActivateFn = () => {
  const board = inject(BoardService);
  const router = inject(Router);

  if (board.userName()) {
    return true;
  }

  return router.createUrlTree(['/login']);
};

export const guestGuard: CanActivateFn = () => {
  const board = inject(BoardService);
  const router = inject(Router);

  if (board.userName()) {
    return router.createUrlTree(['/dashboard']);
  }

  return true;
};
