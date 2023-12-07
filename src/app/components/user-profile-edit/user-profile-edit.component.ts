import { UserInfoService } from './../../services/user-info.service';
import { switchMap } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { UserService } from './../../services/user.service';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from 'src/app/models/entities/user';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-user-profile-edit',
  templateUrl: './user-profile-edit.component.html',
  styleUrls: ['./user-profile-edit.component.css']
})
export class UserProfileEditComponent implements OnInit, AfterViewInit {

  nickName: string;

  userSubject = new BehaviorSubject<User | null>(null);
  user$ = this.userSubject.asObservable();

  isVerif2FAVisible: boolean = false;
  constructor(private userService: UserService,private userInfoService:UserInfoService, private authService: AuthService, private route: ActivatedRoute) {

  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((data: any) => {
      this.nickName = String(data['nickname']);
    });
  }

  ngAfterViewInit(): void {
    this.user$.subscribe(response => {
      if (response) {
        this.isVerif2FAVisible = (this.authService.getCurrentUserId() == response.id);
      }
    })
  }

  twoFA() {

  }

  updateUserProfile(){
    this.userInfoService.gets().subscribe(response=>{
      if (response.success){
        alert("ok");
      }
    })
  }
}
