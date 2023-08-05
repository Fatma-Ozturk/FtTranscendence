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
    location.href = "https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-08b0b860cf535abf134549af5c1ec7753fedba9aff80a1914995128c7590d48d&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fapi%2Fauth42%2Flogin&response_type=code"
  }

  Register42(): void
  {
    location.href = "https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-08b0b860cf535abf134549af5c1ec7753fedba9aff80a1914995128c7590d48d&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fapi%2Fauth42%2Fregister&response_type=code"
  }
}
