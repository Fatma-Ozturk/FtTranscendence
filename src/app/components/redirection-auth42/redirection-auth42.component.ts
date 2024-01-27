import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MessageService } from 'primeng/api';
import { Messages } from 'src/app/constants/Messages';
import { User } from 'src/app/models/entities/user';
import { UserInfo } from 'src/app/models/entities/userInfo';
import { AchievementRuleService } from 'src/app/services/achievement-rule.service';
import { AuthService } from 'src/app/services/auth.service';
import { JwtControllerService } from 'src/app/services/jwt-controller.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { UserInfoService } from 'src/app/services/user-info.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-redirection-auth42',
  templateUrl: './redirection-auth42.component.html',
  styleUrls: ['./redirection-auth42.component.css'],
  providers: [MessageService]
})
export class RedirectionAuth42Component {
  private token: string = "";
  private success: string = "";
  private message: string = "";
  constructor(private route: ActivatedRoute,
    private router: Router,
    private jwtControllerService: JwtControllerService,
    private localStorageService: LocalStorageService,
    private toastrService: ToastrService,
    private authService:AuthService,
    private userInfoService: UserInfoService,
    private achievementRuleService:AchievementRuleService) {

  }

  ngOnInit(): void {
    this.token = this.route.snapshot.paramMap.get('token');
    this.success = this.route.snapshot.paramMap.get('success');
    this.message = this.route.snapshot.paramMap.get('message');
    if (this.success === 'false') {
      if (this.message === 'User Already Exists') {
        this.toastrService.error(Messages.userAlreadyExists);
      }
      if (this.message === 'User Not Found') {
        this.toastrService.error(Messages.userNotFound);
      }
      if (this.message === 'Password Error') {
        this.toastrService.error(Messages.passwordError);
      }
      this.router.navigate(['/main']);
    }
    if (this.success === 'true') {
      if (this.jwtControllerService.isActive(this.token)) {
        this.localStorageService.saveItem("token", this.token);
        this.updateUserInfo();
        this.checkAchievement('sign');
        this.router.navigate(['/view'])
        this.toastrService.info(Messages.success);
      }
    }
  }

  updateUserInfo() {
    let currentUserId = this.authService.getCurrentUserId();
    let userInfo: UserInfo = {
      id: 0,
      userId: currentUserId,
      loginDate: new Date(),
      profileCheck: true,
      profileImagePath: "",
      profileText: "",
      gender: false,
      birthdayDate: new Date()
    };
    this.userInfoService.add(userInfo).subscribe(response => {
      if (response.success) {
      }
    }, responseError => {
      if (responseError.error) {
        this.toastrService.error(Messages.error);
      }
    })
  }

  checkAchievement(achievementName: string) {
    let currentUserId = this.authService.getCurrentUserId();
    console.log("currentUserId ", currentUserId);
    return this.achievementRuleService.checkAchievement(currentUserId, achievementName);
  }
}
