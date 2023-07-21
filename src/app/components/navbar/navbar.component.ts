import { ActivePageNameService } from './../../services/active-page-name.service';
import { AuthService } from './../../services/auth.service';
import { HostListener, Renderer2, SimpleChanges } from '@angular/core';
import { ViewChild } from '@angular/core';
import { ElementRef } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { Router, ROUTES } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { BehaviorSubject } from 'rxjs';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  isAuthBool:boolean = false;
  items: MenuItem[];
  activePageNameNav: string;
  visibleSidebar1: any;
  constructor(
    private authService: AuthService,
    private router: Router,
    private activePageNameService: ActivePageNameService
  ) {
    this.getActivePageName();
  }
  ngOnInit(): void {
    this.updateAuthBool();
    this.loadMenu();
    this.getActivePageName();
  }
  ngAfterViewInit():void
  {
    let intervalId = setInterval(() => {
      this.updateAuthBool();
      if (this.isAuthBool == true && this.authService.isAuthenticadet()) {
        this.loadMenu();
        clearInterval(intervalId);
      }
    }, 100);
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
            items: [
              {
                label: 'Filtre',
                icon: 'pi pi-fw pi-filter',
                items: [
                  {
                    label: 'Yazdır',
                    icon: 'pi pi-fw pi-print'
                  }
                ]
              },
              {
                icon: 'pi pi-fw pi-bars',
                label: 'Görüntüle'
              }
            ]
          }
        ]
      },
      {
        label: 'Çıkış',
        icon: 'pi pi-fw pi-power-off',
        visible: this.isAuthenticadet(),
        command: () => this.signOut(),
        routerLink: ['/']

      },
      {
        label: 'Leaderboard',
        icon: 'pi pi-fw pi-leaderboard',
        visible: this.isAuthenticadet(),
        command: () => this.leaderboard,
        routerLink: ['/leaderboard']

      }
    ];
  }
  leaderboard () {

  }
  updateAuthBool() {
    const token = localStorage.getItem('token');
    this.isAuthBool = token !== null && token !== undefined && this.authService.isAuthenticadet();
  }
  isAuthenticadet() {
    return this.authService.isAuthenticadet();
  }
  getFullName(): string {
    return this.authService.getCurrentFullName();
  }
  signOut() {
    this.isAuthenticadet();
    localStorage.clear();
    location.reload();
    this.router.navigate(['login']);
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
}
