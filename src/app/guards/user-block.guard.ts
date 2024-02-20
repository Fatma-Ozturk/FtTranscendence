import { UserService } from 'src/app/services/user.service';
import { AuthService } from 'src/app/services/auth.service';
import { CanActivateFn, Router } from '@angular/router';
import { UserBlockService } from '../services/user-block.service';
import { inject } from '@angular/core';
import { User } from '../models/entities/user';
import { UserBlock } from '../models/entities/userBlock';
import { catchError, map, of, switchMap, tap } from 'rxjs';

export const userBlockGuard: CanActivateFn = (route, state) => {
	let router = inject(Router);
	let authService = inject(AuthService);
	let userBlockService = inject(UserBlockService);
	let userService = inject(UserService);
	let blockerId = authService.getCurrentUserId();
	let nickName = route.paramMap.get('nickname');

	return userService.getByNickName(nickName).pipe(
		tap(user => console.log('User fetched:', user)),
		switchMap(user => {
			if (!user) {
				return of(true);
			}
			return userBlockService.getByBlockerId(blockerId).pipe(
				map((blocks: any) => {
					console.log("blocks.data ", blocks.data);

					let blocked:boolean = blocks.data.some((block: UserBlock) => block.blockedId === user.data.id);
					console.log("blocked ", blocked);

					// if (blocked == true) {
					// 	window.location.href = ('https://www.youtube.com/watch?v=gBRQGqb04Y0');
					// }
					return !blocked;
				}),
				catchError(() => of(true))
			);
		}),
		catchError(() => of(true))
	);
};
