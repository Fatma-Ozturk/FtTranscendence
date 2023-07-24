import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { MainComponent } from './components/main/main.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { RegisterComponent } from './components/register/register.component';
import { ViewComponent } from './components/view/view.component';
import { loginGuard } from './guards/login.guard';
import { notLoginGuard } from './guards/not-login.guard';
import { LeaderboardComponent } from './components/leaderboard/leaderboard.component';
import { ChatComponent } from './components/chat/chat.component';

const routes: Routes = [
  { path: "", pathMatch: "full", component: MainComponent, canActivate: [notLoginGuard] },
  { path: '404', pathMatch: "full", component: NotFoundComponent },
  { path: "main", component: MainComponent, canActivate: [notLoginGuard] },
  { path: "login", component: LoginComponent, canActivate: [notLoginGuard] },
  { path: "view", component: ViewComponent, canActivate: [loginGuard] },
  { path: "register", component: RegisterComponent, canActivate: [notLoginGuard] },
  { path: "leaderboard", component: LeaderboardComponent, canActivate: [notLoginGuard]},
  { path: "chat", component: ChatComponent, canActivate: [notLoginGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
