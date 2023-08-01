import { UserForSearchDto } from './../../models/dto/userForSearchDto';
import { ToastrService } from 'ngx-toastr';
import { UserService } from './../../services/user.service';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/entities/user';
import { Messages } from 'src/app/constants/Messages';

@Component({
  selector: 'app-search-users',
  templateUrl: './search-users.component.html',
  styleUrls: ['./search-users.component.css']
})
export class SearchUsersComponent {
  searchUsersForm: FormGroup;
  users:User[] = [];
  constructor(private formBuilder: FormBuilder,
              private userService:UserService,
              private toastrService: ToastrService) {
    
  }
  ngOnInit():void{
    this.createSearchUsersFrom();
  }

  createSearchUsersFrom() {
    this.searchUsersForm = this.formBuilder.group({
      "searchtext": ["", [Validators.required, Validators.minLength(3)]],
    })
  }

  search(){
    let loginModel = Object.assign({}, this.searchUsersForm.value);
    let userForSearchDto:UserForSearchDto = {
      firstName: loginModel.searchtext,
    };
    this.userService.getByAttributes(userForSearchDto).subscribe(response => {
      this.users = response.data;
    }, responseError => {
      this.toastrService.error(Messages.error);
    });
  }

  onSubmit(): void {
    if (!this.searchUsersForm.valid)
      return;
    this.search();
  }
}
