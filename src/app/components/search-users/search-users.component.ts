import { UserForSearchDto } from './../../models/dto/userForSearchDto';
import { ToastrService } from 'ngx-toastr';
import { UserService } from './../../services/user.service';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/entities/user';
import { Messages } from 'src/app/constants/Messages';
import { RegexService } from 'src/app/utilities/regex';
import { UserInfo } from 'src/app/models/entities/userInfo';
import { UserInfoService } from 'src/app/services/user-info.service';
import { UserForUserInfoDto } from 'src/app/models/dto/userForUserInfoDto';

@Component({
  selector: 'app-search-users',
  templateUrl: './search-users.component.html',
  styleUrls: ['./search-users.component.css']
})
export class SearchUsersComponent {
  searchUsersForm: FormGroup;
  userForUserInfoDtos: UserForUserInfoDto[] = [];
  constructor(private formBuilder: FormBuilder,
    private userInfoService: UserInfoService,
    private toastrService: ToastrService) {

  }
  ngOnInit(): void {
    this.createSearchUsersFrom();
  }

  createSearchUsersFrom() {
    this.searchUsersForm = this.formBuilder.group({
      "searchtext": ["", [Validators.minLength(0)]],
    })
  }

  search() {
    let loginModel = Object.assign({}, this.searchUsersForm.value);
    let userForSearchDto: UserForSearchDto = {};
    [...loginModel.searchtext].forEach((res) => {
      if (RegexService.isValidEmail(res)){
        userForSearchDto.email = res;
      }
      else if (RegexService.isAlphabetic(res)) {
        userForSearchDto.nickName = res;
      }
      else if (RegexService.hasSingleSpaceAndAlphabetic(res)){
        let splittingFullName = res.split(" ");
        userForSearchDto.firstName = splittingFullName[0];
        userForSearchDto.lastName = splittingFullName[1];
      }
      else if (RegexService.isPhoneNumber(res)){
        userForSearchDto.phone = res;
      }
    })
    this.userInfoService.getByAttributes(userForSearchDto).subscribe(response => {
      if (response.success){
        this.userForUserInfoDtos = response.data;
        this.toastrService.success(Messages.success);
      }
    }, responseError => {
      if (responseError.error){
        this.toastrService.error(Messages.error);
      }
    });
  }

  onSubmit(): void {
    if (!this.searchUsersForm.valid)
      return;
    this.search();
  }

  clearForm() {
    this.searchUsersForm.reset(); // Formu temizle
  }

  clearSearched(){
    this.userForUserInfoDtos.splice(0);
  }

  clearAll(){
    this.clearForm();
    this.clearSearched();
  }
}
