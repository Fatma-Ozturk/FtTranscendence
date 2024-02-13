import { UserService } from './../../services/user.service';
import { Component, Input } from '@angular/core';
import { User } from 'src/app/models/entities/user';

@Component({
  selector: 'app-user-profile-card',
  templateUrl: './user-profile-card.component.html',
  styleUrls: ['./user-profile-card.component.css']
})
export class UserProfileCardComponent {
  @Input() user: User;
  constructor(private userService:UserService) {
  }

  ngOnInint(): void{

  }

  getUserProfile(){

  }
}
