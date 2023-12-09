import { UserInfoService } from './../../services/user-info.service';
import { switchMap } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { UserService } from './../../services/user.service';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from 'src/app/models/entities/user';
import { AuthService } from 'src/app/services/auth.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserInfo } from 'src/app/models/entities/userInfo';

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

  //user-info form
  userInfo: UserInfo;
  userInfoForm: FormGroup;
  userInfoFormVisible: boolean = false;

  //user form
  user: User;
  userForm: FormGroup;
  userFormVisible: boolean = false;

  //form
  validatorRequired: string = "";
  lockedButtonClass: boolean = false;

  //menutItems
  menuItems: any;

  //userVerif
  userVerifVisible: boolean = false;

  //towFa
  twoFAVisible: boolean = false;
  constructor(private userService: UserService,
    private userInfoService: UserInfoService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder) {

  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((data: any) => {
      this.nickName = String(data['nickname']);
    });

    this.userForm = this.formBuilder.group({
      firstName: ['', Validators.compose([Validators.required, Validators.nullValidator])],
      lastName: ['', Validators.compose([Validators.required, Validators.nullValidator])],
      nickName: ['', Validators.compose([Validators.required, Validators.nullValidator])],
    });

    this.userInfoForm = this.formBuilder.group({
      profileText: ['', Validators.compose([Validators.required, Validators.nullValidator])],
      gender: ['', Validators.compose([Validators.required, Validators.nullValidator])],
      birthdayDate: ['', Validators.compose([Validators.required, Validators.nullValidator])],
    });

    this.getMenuItems();
  }

  ngAfterViewInit(): void {
    this.user$.subscribe(response => {
      if (response) {
        this.isVerif2FAVisible = (this.authService.getCurrentUserId() == response.id);
      }
    })
  }

  getUserByNickName(){
    this.userService.getByNickName(this.nickName).subscribe(response=>{
      if (response.success){
        this.user = response.data;
      }
    });
  }

  getUserInfo(){
    this.userInfoService.getByNickName(this.nickName).subscribe(response=>{
      if (response.success){
        this.userInfo = response.data;
      }
    });
  }

  updateUser(){
    this.userService.update(this.user).subscribe(response=>{
      if (response.success){

      }
    }, responseError=>{

    })
  }

  updateUserInfo(){

  }

  getMenuItems() {
    this.menuItems = [
      {
        label: 'Kullanıcı',
        icon: 'pi pi-fw pi-user',
        items: [
          {
            label: 'Genel Bilgiler',
            icon: 'pi pi-fw pi-user-plus',
            command: () => this.visibleUser(),
          },
          {
            label: 'Tanımlamlar',
            icon: 'pi pi-fw pi-user-minus',
            command: () => this.visibleUserInfo()
          },
        ]
      },
      {
        label: 'Hesap',
        icon: 'pi pi-fw pi-user',
        items: [
          {
            label: 'Onay',
            icon: 'pi pi-fw pi-user-plus',
            command: () => this.visibleUserVerif()
          },
          {
            label: 'Doğrulama',
            icon: 'pi pi-fw pi-user-minus'
          },
        ]
      },
      {
        label: 'Günenlik',
        icon: 'pi pi-fw pi-user',
        items: [
          {
            label: 'İki Adımlı Google Doğrulama',
            icon: 'pi pi-fw pi-user-plus',
            command: () => this.visibleTwoFA()
          },
          {
            label: 'İki Adımlı E-Posta Doğrulama',
            icon: 'pi pi-fw pi-user-minus'
          },
          {
            label: 'İki Adımlı Telefon Doğrulama',
            icon: 'pi pi-fw pi-user-minus'
          },
        ]
      },
      {
        label: 'Olaylar',
        icon: 'pi pi-fw pi-calendar',
        items: [
          {
            label: 'Edit',
            icon: 'pi pi-fw pi-pencil',
            items: [
              {
                label: 'Save',
                icon: 'pi pi-fw pi-calendar-plus'
              },
              {
                label: 'Delete',
                icon: 'pi pi-fw pi-calendar-minus'
              }
            ]
          },
          {
            label: 'Archieve',
            icon: 'pi pi-fw pi-calendar-times',
            items: [
              {
                label: 'Remove',
                icon: 'pi pi-fw pi-calendar-minus'
              }
            ]
          }
        ]
      }
    ];
  }

  twoFA() {

  }

  updateUserProfile() {
    this.userInfoService.gets().subscribe(response => {
      if (response.success) {
        alert("ok");
      }
    })
  }

  visibleUser(){
    this.userFormVisible = !this.userFormVisible;
    this.userInfoFormVisible = false;
    this.twoFAVisible = false;
    this.userVerifVisible = false;
  }
  

  visibleUserInfo(){
    this.userInfoFormVisible = !this.userInfoFormVisible;
    this.userFormVisible = false;
    this.twoFAVisible = false;
    this.userVerifVisible = false;
  }

  visibleTwoFA(){
    this.twoFAVisible = !this.twoFAVisible;
    this.userInfoFormVisible = false;
    this.userFormVisible = false;
    this.userVerifVisible = false;
  }

  visibleUserVerif(){
    this.userVerifVisible = !this.userVerifVisible;
    this.userInfoFormVisible = false;
    this.userFormVisible = false;
    this.twoFAVisible = false;
  }
}
