import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const editableProfileGuard: CanActivateFn = (route, state) => {
  let nickName:string = route.paramMap.get('nickname')
  return inject(AuthService).currentUserIsCurrentSameInUrl(nickName);
};
