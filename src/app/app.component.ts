import { UserTwoFAService } from './services/user-two-fa.service';
import { User } from './models/entities/user';
import { UserService } from './services/user.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { ChangeDetectorRef, Component, OnInit, SimpleChange } from '@angular/core';
import { BehaviorSubject, from, of, switchMap, tap } from 'rxjs';
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
		this.getActivePageName();
		this.isAuther();
		this.monitorRouterEvents();
	}
	ngOnInit(): void {
		this.authService.isAuthenticadet();
		this.isAuther();
		this.getActivePageName();
	}
	ngAfterViewInit(): void {
		this.isAuther();
	}
	isAuther() {
		// Öncelikle, kullanıcının doğrulanıp doğrulanmadığını kontrol edin
		this.authService.getIsAuth().pipe(
			tap(response => {
				// isAuthBoolSubject güncellenir
				this.isAuthBoolSubject.next(response);
			}),
			switchMap(response => {
				if (response) {
					// Kullanıcı doğrulanmışsa, ek bilgileri al
					this.currentNickName = this.authService.getCurrentNickName();
					this.currentUserId = this.authService.getCurrentUserId();
					// Kullanıcı doğrulama durumunu kontrol et
					return this.isUserVerify();
				} else {
					// Kullanıcı doğrulanmamışsa, akışı burada sonlandır
					return of(null);
				}
			})
		).subscribe({
			next: (response: any) => {
				if (response) {
					// Kullanıcının doğrulama durumuna göre isVerifContainerVisibleSubject güncellenir
					this.isVerifContainerVisibleSubject.next(response?.success ? response.data.isVerify : false);
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
