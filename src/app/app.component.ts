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
  public dataObsevable: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);

  constructor(private authService: AuthService,
    private loadProgressService: LoadProgressService,
    private sidebarService: SidebarService,
    private changeDetectorRef: ChangeDetectorRef,
    private activePageNameService: ActivePageNameService){
      this.getActivePageName()
    }

    ngOnInit(): void {
      this.authService.isAuthenticadet()
      this.isAuthClass();
      this.isAuthWrapperClass();
      this.isAutherMainPanel();
      this.isAuther();
      this.getActivePageName()
      console.log(this.activePageNameString)
      // this.authService.isAuth.subscribe(response => {
      //   this.isAuth=response
      //   this.isAuthClass(response);
      //   if (response) {
      //     this.isMainClass = "main-panel";
      //   } else if (response == false) {
      //     this.isMainClass = "";
      //   }
      //   //console.log(response);
      // })
  
     //this.isVisibleApp=false;
    }
    ngOnChanges(changes: SimpleChange): void {
      this.getActivePageName()
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
