import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';

export const notLoginGuard: CanActivateFn = (route, state) => {
  return !inject(AuthService).isAuthenticadet();
};
