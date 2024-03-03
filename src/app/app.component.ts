import { UserTwoFAService } from './services/user-two-fa.service';
import { User } from './models/entities/user';
import { UserService } from './services/user.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { ChangeDetectorRef, Component, OnInit, SimpleChange } from '@angular/core';
import { BehaviorSubject, distinctUntilChanged, from, of, shareReplay, switchMap, tap } from 'rxjs';
import { ActivePageNameService } from './services/active-page-name.service';
import { AuthService } from './services/auth.service';
import { LoadProgressService } from './services/load-progress.service';
import { SidebarService } from './services/sidebar.service';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
	title = 'FtTranscendence';
	isAuthBoolSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
	isAuthBool$ = this.isAuthBoolSubject.asObservable();
	loaderDisplay: string;
	activePageNameString: string;
	isMainClass: string;
	pageNotFoundVisibility: boolean = true;
	currentNickName: string;
	currentUserId: number;
	isVerifContainerVisibleSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
	isVerifContainerVisible$ = this.isVerifContainerVisibleSubject.asObservable();

	constructor(private authService: AuthService,
		private userService: UserService,
		private loadProgressService: LoadProgressService,
		private sidebarService: SidebarService,
		private changeDetectorRef: ChangeDetectorRef,
		private activePageNameService: ActivePageNameService,
		private router: Router,
		private activatedRoute: ActivatedRoute,
		private userTwoFAService: UserTwoFAService) {
		this.isAuther();
		this.getActivePageName();
		this.monitorRouterEvents();
	}
	ngOnInit(): void {
		this.authService.isAuthenticadet();
		this.isAuther();
		this.getActivePageName();
	}
	isAuther() {
		this.authService.getIsAuth().pipe(
			distinctUntilChanged(), // Yalnızca önceki değerden farklı olduğunda çalışır.
			tap(isAuthenticated => {
				this.isAuthBoolSubject.next(isAuthenticated);
				if (!isAuthenticated) {
					// Kullanıcı kimlik doğrulaması başarısız olursa, 2FA konteynerini gizle.
					this.isVerifContainerVisibleSubject.next(false);
				}
			}),
			switchMap(isAuthenticated => {
				if (isAuthenticated) {
					this.currentNickName = this.authService.getCurrentNickName();
					this.currentUserId = this.authService.getCurrentUserId();
					return this.userTwoFAService.getByUserId(this.currentUserId);
				} else {
					return of(null); // Kullanıcı kimlik doğrulaması başarısız olduğunda bir sonraki adıma geçme.
				}
			}),
		).subscribe({
			next: response => {
				if (!response || response == null) {
					this.isVerifContainerVisibleSubject.next(true);
				} else if (response && response.data && !response.data.isTwoFA) {
					this.isVerifContainerVisibleSubject.next(true);
				} else if (response && response.data && response.data.isTwoFA) {
					this.isVerifContainerVisibleSubject.next(response.data.isVerify);
				}
			},
			error: err => {
				console.error("Authentication verification failed", err);
			}
		});
	}
	updateAuthBool() {
		const token = localStorage.getItem('token');
		const isAuthBool = token !== null && token !== undefined && this.authService.isAuthenticadet();
		this.isAuthBoolSubject.next(isAuthBool);
	}
	getActivePageName() {
		this.activePageNameService.loadActivePage();
		this.activePageNameService.activePageName.subscribe(response => {
			this.activePageNameString = response;
		});
	}
	isUserVerify() {
		return this.userTwoFAService.getByUserId(this.currentUserId);
	}
	private monitorRouterEvents(): void {
		this.router.events.subscribe((event) => {
			if (event instanceof NavigationEnd) {
				this.pageNotFoundVisibility = event.url === '/404';
			}
		});
	}
}
