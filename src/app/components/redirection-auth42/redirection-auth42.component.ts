import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { JwtControllerService } from 'src/app/services/jwt-controller.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';

@Component({
  selector: 'app-redirection-auth42',
  templateUrl: './redirection-auth42.component.html',
  styleUrls: ['./redirection-auth42.component.css']
})
export class RedirectionAuth42Component {
  private token: string = "";
  private success: boolean;
  private message: string = "";
  constructor(private route: ActivatedRoute,
    private router: Router,
    private jwtControllerService: JwtControllerService,
    private localStorageService: LocalStorageService) {

  }

  ngOnInit(): void {
    this.token = this.route.snapshot.paramMap.get('token');
    this.success = Boolean(this.route.snapshot.paramMap.get('success'));
    this.message = this.route.snapshot.paramMap.get('message');
    console.log("this.success " + this.success);
    // if (!this.success)
    //   this.router.navigate(['/main']);
    if (this.jwtControllerService.isActive(this.token)) {
      this.localStorageService.saveItem("token", this.token);
      this.router.navigate(['/view']);
    }
  }
}
