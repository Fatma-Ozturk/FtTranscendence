import { Router } from '@angular/router';
import { ChangeDetectorRef, Component, OnInit, SimpleChange } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
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
  isAuthBool:boolean;
  isAuthMainPanelApp: string;
  mainDisplay: string;
  loaderDisplay: string;
  isAuth: boolean
  activePageNameString:string;
  isMainClass: string;
  userStatus: boolean = false;
  public dataObsevable: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);

  constructor(private authService: AuthService,
    private loadProgressService: LoadProgressService,
    private sidebarService: SidebarService,
    private changeDetectorRef: ChangeDetectorRef,
    private activePageNameService: ActivePageNameService,
    private router:Router){
      this.getActivePageName()
    }

    ngOnInit(): void {
      this.authService.isAuthenticadet()
      this.isAuthClass();
      this.isAuthWrapperClass();
      this.isAutherMainPanel();
      this.isAuther();
      this.getActivePageName()
    }
    ngOnChanges(changes: SimpleChange): void {
      this.getActivePageName()
      // this.userStatus = this.authService.getCurrentStatus();
      // if (this.authService.isAuthenticadet() && !this.userStatus && window.location.href.toString().indexOf("create-user-profile") <= -1){
      //   console.log("ok oko kokoko");
      //   this.router.navigate(['/create-user-profile'])
      // }
    }
    ngAfterViewInit():void{
      this.isAuther()
      this.getActivePageName()
      console.log(this.activePageNameString)
    }
    isAutherMainPanel(){
      this.authService.isAuthenticadet()
      this.authService.isAuth.subscribe(response => {
        if (response==true) {
          this.isAuthMainPanelApp="main-panel"
        }else{
          this.isAuthMainPanelApp=""
        }
      })
      //console.log(this.isAuthMainPanelApp);
    }
    isAuther(){
      this.authService.isAuthenticadet()
      this.authService.isAuth.subscribe(response => {
        this.isAuthBool=response;
        //console.log(this.isAuthBool)
      })
      // this.userStatus = this.authService.getCurrentStatus();
      // if (this.authService.isAuthenticadet() && !this.userStatus && window.location.href.toString().indexOf("create-user-profile") <= -1){
      //   console.log("ok oko kokoko");
      //   this.router.navigate(['/create-user-profile'])
      // }
    }
    isAuthClass() {
      let result: boolean;
      this.authService.isAuthenticadet()
      this.authService.isAuth.subscribe(response => {
        result = response;
      })
      //console.log(result)
      if (result) {
        return "sidebar visible";
      }
      return "d-none w-0 h-0 invisible"
    }
    isAuthWrapperClass() {
      let result: boolean;
      this.authService.isAuthenticadet()
      this.authService.isAuth.subscribe(response => {
        result = response;
      })
      //console.log(result)
      if (result) {
        return "wrapper visible";
      }
      return "d-none w-0 h-0 invisible"
    }
    sidebarVisibility():string{
      return String(this.sidebarService.getVisibility());
    }
    getActivePageName() {
      this.activePageNameService.loadActivePage();
      this.activePageNameService.activePageName.subscribe(response => {
        this.activePageNameString = response;
      });
    }
    // prepareRoute(outlet: RouterOutlet) {
    //   return outlet && outlet.activatedRouteData && outlet.activatedRouteData.animation;
    // }
}
