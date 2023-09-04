import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/services/user.service';
import { Component } from '@angular/core';
import { User } from 'src/app/models/entities/user';
import { Messages } from 'src/app/constants/Messages';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent {

  user: User;
  constructor(private userService: UserService,
    private toastrService: ToastrService,
    private route: ActivatedRoute,
    private router: Router) {

  }

  ngOnInit(): void {
    let nickName = this.route.snapshot.paramMap.get('nickname');
    this.getUserByNickName(nickName);
  }

  getUserByNickName(nickName: string) {
    this.userService.getByNickName(nickName).subscribe(response => {
      if (response.success) {
        this.user = response.data;
      }
    }, responseError => {
      if (responseError.error) {
        this.toastrService.error(Messages.error);
      }
    });
  }
}
