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
		// Kullanıcı girişi yapılmamışsa veya currentId yoksa, erişimi reddet
		router.navigate(['/user-two-fa']);
		return of(false);
	}

	return userTwoFAService.getByUserId(currentId).pipe(
		// tap(response => console.log('UserTwoFA fetched:', response.data.isVerify && response.data.isTwoFA)),
		map(response => {
			// Kullanıcının 2FA doğrulaması varsa ve 2FA aktifse, true dön
			// Not: response yapısının doğru olduğunu varsayıyorum. Gerçek response yapınıza göre ayarlama yapmanız gerekebilir.
			if (!response.data){
				router.navigate(['/user-two-fa']);
				return false;
			}
			if(response.data.isVerify && response.data.isTwoFA){
				return true;
			}
			router.navigate(['/user-two-fa']);
			return false;
		})
	);
};
