import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-auth42',
  templateUrl: './auth42.component.html',
  styleUrls: ['./auth42.component.css']
})
export class Auth42Component {

  @Input() isLoginOrRegister:boolean;

  Login42(): void
  {
    location.href = "https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-6ce3bbd8b4ee219bbe5b561f5f9209f507308060a3a8f3ddee8dbcea6e1c906a&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fapi%2Fauth42%2Flogin&response_type=code"
  }

  Register42(): void
  {
    location.href = "https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-b573ae099adcf6f927bb38d2d0612e247c9d23c772a292d91b49046b9ac645fd&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fapi%2Fauth42%2Fregister&response_type=code"
  }
}
