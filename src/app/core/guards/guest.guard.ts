import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const guestGuard: CanActivateFn = () => {
  const auth = inject(AuthService);

  if (!auth.isLoggedIn()) return true;

  const role = auth.getRole();
  if (role) auth.redirectByRole(role);
  return false;
};
