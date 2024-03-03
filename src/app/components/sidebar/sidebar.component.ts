import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ActivePageNameService } from 'src/app/services/active-page-name.service';
import { AuthService } from 'src/app/services/auth.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  @ViewChild('id') id: ElementRef;
  @ViewChild('menuItemId') menuItemId: HTMLElement;

  localAuth: boolean = false;
  private role: string;
  public roleCheckClass: string;
  public menuItems: any[];
  public menuChildItems: any[];
  public menuChildedItems: RouteChilInfo[];
  menuChildVisibleClass: string;
  menuChildVisibleBoolean: boolean = true;
  breakMathIconName: string = "pi-chevron-down";
  menuItemAColor: string;
  visibleSidebar1:any;
  constructor(private activePageNameService: ActivePageNameService,
    private router: Router,
    private authService: AuthService,
    private renderer: Renderer2,
    private localStorageService: LocalStorageService) {
    this.authService.roleName.subscribe(response => {
      this.role = response;
    })
    this.getMenu();
  }
  ngOnInit() {
    this.getMenu();
    this.routeLocalStorageGetColor();
  }
  getMenu() {
    this.role = this.authService.getCurrentRole();
    this.authService.roleName.subscribe(response => {
      this.role = response;
    })
    if (this.role != null && this.role.indexOf("developer") > -1) {
      this.roleCheckClass = "";
      ROUTES.forEach(element => {
        if (element.chilName === "claim") {
          element.class = ""
        }
      });
    } else {
      ROUTES.forEach(element => {
        if (element.chilName === "claim") {
          element.class = "d-none"
        }
      });
    }

    this.authService.isAuth.subscribe(response => {
      if (response) {
        this.localAuth = response
      }
    })
    this.menuItems = ROUTES.filter(menuItem => menuItem);
    this.menuChildItems = ROUTESCHIL.filter(menuchilItem => menuchilItem);
  }
  getChildItems(name: string) {
    this.menuChildedItems = this.menuChildItems.filter(p => p.name == name)
  }
  isNameIsChildName(name: string, nameChild: string) {
    if (name === nameChild) {
      return true;
    }
    return false
  }
  setActivePageName(object: any) {
    this.activePageNameService.pageName = object.title;
    this.activePageNameService.saveActivePage();
    this.menuChildVisibleBoolean = true;
    this.menuChildVisibleClass = "";
  }
  setActivePageNameForMenuItem(object: any) {
    if (ROUTESCHIL.filter(filtre => filtre.name == object.chilName).length == 0) {
      this.activePageNameService.pageName = object.title;
      this.activePageNameService.saveActivePage();
    }

  }
  routeForOne(object: RouteInfo) {
    if (ROUTESCHIL.filter(filtre => filtre.name == object.chilName).length == 0) {
      this.router.navigateByUrl(object.path)
    }
  }
  childVisible(object: any) {
    this.menuChildItems.forEach(element => {
      if (element.name == object.chilName) {
        if (element.class === "") {
          element.class = "d-none"
          object.chilIcon = "pi-chevron-right"
        } else if (element.class === "d-none") {
          element.class = ""
          object.chilIcon = "pi-chevron-down"
        }
      }
    });
  }
  isBreak(object: any): boolean {
    if (ROUTESCHIL.filter(filtre => filtre.name == object.chilName).length != 0) {
      return true;
    }
    return false;
  }
  routeChangeColor(object: any) {
    if (this.menuChildItems.filter(filtre => filtre.name == object.chilName).length == 0) {
      this.menuItems.forEach(element => {
        if (element.title === object.title) {
          element.style = "background-color:#e9ecef;font-weight: bold;"
        } else if (element.title !== object.title) {
          element.style = ""
        }
      });
    }
    if (this.menuChildItems.filter(filtre => filtre.name == object.chilName).length == 0) {
      this.menuChildItems.forEach(element => {
        element.style = ""
      });
    }
  }
  routeChangeColorChild(object: any, chilObject: any) {
    if (this.menuChildItems.filter(filtre => filtre.name == object.chilName).length != 0) {
      this.menuChildItems.forEach(element => {
        if (element.name === object.chilName && element.title === chilObject.title) {
          element.style = "background-color:#e9ecef;font-weight: bold;"
          this.routeLocalStorageSaveColor();
        } else if (element.title !== chilObject.title || element.name !== object.chilName) {
          element.style = ""
        }
      });
    }
    this.menuItems.forEach(element => {
      element.style = ""
    });
  }
  routeLocalStorageSaveColor() {
    let menuChildVisibility: string[] = [];
    this.menuChildItems.forEach(element => {
      menuChildVisibility.push(element.style)
    });
    this.localStorageService.saveItem("menuChilVisibilityColor", menuChildVisibility.toString());
  }
  routeLocalStorageGetColor() {
    // let menuChildVisibilityGet: any = this.localStorageService.get("menuChilVisibilityColor");
    // let menuChildVisibility:string[] = menuChildVisibilityGet.split(",")
    // for (let index = 0; index < menuChildVisibility.length; index++) {
    //   this.menuChildItems[index].style=menuChildVisibility
    // }
  }
}

export const ROUTES: RouteInfo[] = [
  { path: '/userlist', chilName: "users", chilIcon: "", title: 'Kullanıcılar', icon: 'people', class: '', style: '' }
];
export interface RouteInfo {
  path?: string;
  chilName: string;
  chilIcon: string;
  title: string;
  icon: string;
  class: string;
  style: string;
}
export const ROUTESCHIL: RouteChilInfo[] = [];

export interface RouteChilInfo {
  name: string
  path?: string;
  title: string;
  icon: string;
  class: string;
  style: string;
}
