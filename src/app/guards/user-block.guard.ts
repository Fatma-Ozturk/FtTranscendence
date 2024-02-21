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
	let currentId = authService.getCurrentUserId();
	let nickName = route.paramMap.get('nickname');

	return userService.getByNickName(nickName).pipe(
		tap(user => console.log('User fetched:', user)),
		switchMap(user => {
			if (!user) {
				return of(true);
			}
			return userBlockService.getByBlockerIdBlockedId({
				id: 0,
				blockerId: Number(user.data.id),
				blockedId: Number(currentId),
				createdAt: new Date(),
				updateTime: new Date(),
				status: true
			}).pipe(
				map((block: any) => {
					console.log("blocks.data ", block.data);
					console.log("user.data.id ", user.data.id);

					// let blocked:UserBlock = blocks.data.find((block: UserBlock) => block.blockedId === user.data.id);
					// console.log("blocked ", blocked);

					//
					if (block && block.success == true){
						return false;
					}
					return (true);
				}),
				catchError(() => of(true))
			);
		}),
		catchError(() => of(true))
	);
};
