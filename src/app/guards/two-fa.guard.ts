import { UserTwoFAService } from './../services/user-two-fa.service';
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, of, switchMap, tap } from 'rxjs';

export const twoFAGuard: CanActivateFn = (route, state) => {
	const router = inject(Router);
	const authService = inject(AuthService);
	const userTwoFAService = inject(UserTwoFAService);
	const currentId = authService.getCurrentUserId();

	if (!currentId) {
		router.navigate(['/user-two-fa']);
		return of(false);
	}

	return userTwoFAService.getByUserId(currentId).pipe(
		map(response => {
			if (!response.data || response.data == null){
				return true;
			}
			if (response && response.data.isTwoFA == false){
				return true;
			}
			if(response.data.isVerify && response.data.isTwoFA){
				return true;
			}
			router.navigate(['/user-two-fa']);
			return false;
		})
	);
};
