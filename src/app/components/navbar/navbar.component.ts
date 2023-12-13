import { UserInfoService } from './../../services/user-info.service';
import { ActivePageNameService } from './../../services/active-page-name.service';
import { AuthService } from './../../services/auth.service';
import { HostListener, Renderer2, SimpleChanges } from '@angular/core';
import { ViewChild } from '@angular/core';
import { ElementRef } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { Router, ROUTES } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { BehaviorSubject } from 'rxjs';
import { UserInfo } from 'src/app/models/entities/userInfo';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  isAuthBool: boolean = false;
  items: MenuItem[];
  activePageNameNav: string;
  visibleSidebar1: any;

  userInfoSubject = new BehaviorSubject<UserInfo | null>(null);
  userInfo$ = this.userInfoSubject.asObservable();

  profileUrl: string = "https://source.unsplash.com/random/150x150";

  constructor(
    private authService: AuthService,
    private router: Router,
    private activePageNameService: ActivePageNameService,
    private userInfoService: UserInfoService
  ) {
    this.getActivePageName();
  }
  ngOnInit(): void {
    this.updateAuthBool();
    this.loadMenu();
    this.getActivePageName();
    this.getUserInfo();
  }
  ngAfterViewInit(): void {
    let intervalId = setInterval(() => {
      this.updateAuthBool();
      if (this.isAuthBool == true && this.authService.isAuthenticadet()) {
        this.loadMenu();
        clearInterval(intervalId);
      }
    }, 100);

    this.userInfo$.subscribe(response => {
      if (response) {
        this.profileUrl = this.userInfoService.getProfileImage(response?.profileImagePath);
      }
    })
  }

  getUserInfo() {
    let getCurrentNickName = this.authService.getCurrentNickName();
    this.userInfoService.getByNickName(getCurrentNickName).subscribe(response => {
      if (response.success) {
        this.userInfoSubject.next(response.data);
      }
    }, responseError => {
      if (responseError.error) {

      }
    });
  }
  getActivePageName() {
    this.activePageNameService.loadActivePage();
    this.activePageNameService.activePageName.subscribe((response) => {
      this.activePageNameNav = response;
    });
  }
  loadMenu(): void {
    this.items = [
      {
        label: 'Ev',
        icon: 'pi pi-fw pi-home',
        command: () => this.visibleMain(),
      },
      {
        label: 'Menü',
        icon: 'pi pi-fw pi-bars',
        visible: this.isAuthenticadet(),
        command: () => this.visibleSidebar()
      },
      {
        label: 'Kullanıcı',
        icon: 'pi pi-fw pi-user',
        escape: false,
        styleClass: "user",
        visible: this.isAuthenticadet(),
        items: [
          {
            label: 'Ara',
            icon: 'pi pi-fw pi-users',
            routerLink: ['/search-users']
          }
        ]
      },
      {
        label: 'Chat',
        icon: 'pi pi-fw pi-inbox',
        visible: this.isAuthenticadet(),
        routerLink: ['/chat-rooms']
      },
      {
        label: 'Leaderboard',
        icon: 'pi pi-fw pi-table',
        visible: this.isAuthenticadet(),
        routerLink: ['/leaderboard']
      },
      {
        label: 'Game',
        icon: 'pi pi-fw pi-play',
        visible: this.isAuthenticadet(),
        routerLink: "/game-matchmaking",
      },
      {
        label: 'Çıkış',
        icon: 'pi pi-fw pi-power-off',
        visible: this.isAuthenticadet(),
        command: () => this.signOut(),
        routerLink: ['/']

      },
    ];
  }
  gameRoute() {
    this.router.navigate(['/game']);
  }
  ChatRoute() {
    this.router.navigate(['/chat']);
  }
  leaderboardRoute() {
    this.router.navigate(['/leaderboard']);
  }
  updateAuthBool() {
    const token = localStorage.getItem('token');
    this.isAuthBool = token !== null && token !== undefined && this.authService.isAuthenticadet();
  }
  isAuthenticadet() {
    return this.authService.isAuthenticadet();
  }
  getNickName(): string {
    return this.authService.getCurrentNickName();
  }
  signOut() {
    this.isAuthenticadet();
    localStorage.clear();
    this.router.navigate(['/']);
  }
  visibleSidebar() {
    this.visibleSidebar1 = true
  }
  visibleMain() {
    if (this.authService.isAuthenticadet()) {
      this.router.navigate(['view']);
    } else {
      this.router.navigate(['main']);
    }
  }
  navigateMyProfile() {
    this.router.navigate(['/user-profile', this.getNickName()]);
  }
}
