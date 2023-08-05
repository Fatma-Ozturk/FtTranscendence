import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MessageService } from 'primeng/api';
import { Messages } from 'src/app/constants/Messages';
import { JwtControllerService } from 'src/app/services/jwt-controller.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';

@Component({
  selector: 'app-redirection-auth-google',
  templateUrl: './redirection-auth-google.component.html',
  styleUrls: ['./redirection-auth-google.component.css'],
  providers: [MessageService]
})
export class RedirectionAuthGoogleComponent {
  private token: string = "";
  private success: string= "";
  private message: string = "";
  constructor(private route: ActivatedRoute,
    private router: Router,
    private jwtControllerService: JwtControllerService,
    private localStorageService: LocalStorageService,
    private toastrService: ToastrService) {

  }

  ngOnInit(): void {
    this.token = this.route.snapshot.paramMap.get('token');
    this.success = this.route.snapshot.paramMap.get('success');
    this.message = this.route.snapshot.paramMap.get('message');

    if (this.success === 'false'){
      if (this.message === 'User Already Exists'){
        this.toastrService.error(Messages.userAlreadyExists);
        this.router.navigate(['/main']);
      }
    }
    if (this.success === 'true'){
      if (this.jwtControllerService.isActive(this.token)) {
        this.localStorageService.saveItem("token", this.token);
        this.router.navigate(['/view']);
      }
    }
  }
}
