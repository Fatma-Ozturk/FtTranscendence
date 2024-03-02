import { UserForUserInfoDto } from './../../models/dto/userForUserInfoDto';
import { UserService } from './../../services/user.service';
import { Component, Input, OnInit } from '@angular/core';
import { User } from 'src/app/models/entities/user';
import { UserInfo } from 'src/app/models/entities/userInfo';
import { UserInfoService } from 'src/app/services/user-info.service';

@Component({
	selector: 'app-user-profile-card',
	templateUrl: './user-profile-card.component.html',
	styleUrls: ['./user-profile-card.component.css']
})
export class UserProfileCardComponent implements OnInit {
	@Input() userForUserInfoDto: UserForUserInfoDto;
	profileUrl: string = "assets/player.png"
	constructor(private userInfoService: UserInfoService) {
	}

	ngOnInit(): void {
		this.getUserProfile();
	}

	getUserProfile() {
		this.profileUrl = this.userInfoService.getProfileImage(this.userForUserInfoDto.profileImagePath);
	}
}
