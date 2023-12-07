import { UserProfileEditComponent } from './components/user-profile-edit/user-profile-edit.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { CreateUserProfileComponent } from './components/create-user-profile/create-user-profile.component';
import { SearchUsersComponent } from './components/search-users/search-users.component';
import { RedirectionAuth42Component } from './components/redirection-auth42/redirection-auth42.component';
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
import { GameComponent } from './components/game/game.component';
import { RedirectionAuthGoogleComponent } from './components/redirection-auth-google/redirection-auth-google.component';
import { GameMatchmakingComponent } from './components/game-matchmaking/game-matchmaking.component';
import { ChatRoomsComponent } from './components/chat-rooms/chat-rooms.component';
import { ChatRoomComponent } from './components/chat-room/chat-room.component';
import { editableProfileGuard } from './guards/editable-profile.guard';

const routes: Routes = [
	{ path: "", pathMatch: "full", component: MainComponent, canActivate: [notLoginGuard] },
	{ path: '404', pathMatch: "full", component: NotFoundComponent },
	{ path: "main", component: MainComponent, canActivate: [notLoginGuard] },
	{ path: "login", component: LoginComponent, canActivate: [notLoginGuard] },
	{ path: "view", component: ViewComponent, canActivate: [loginGuard] },
	{ path: "register", component: RegisterComponent, canActivate: [notLoginGuard] },
	{ path: "redirection-auth42/:token/:success/:message", component: RedirectionAuth42Component },
	{ path: "redirection-auth-google/:token/:success/:message", component: RedirectionAuthGoogleComponent },
	{ path: "leaderboard", component: LeaderboardComponent, canActivate: [loginGuard] },
	{ path: "game", component: GameComponent, canActivate: [loginGuard] },
	{ path: "game-matchmaking", component: GameMatchmakingComponent, canActivate: [loginGuard] },
	{ path: "search-users", component: SearchUsersComponent, canActivate: [loginGuard] },
	{ path: "user-profile/:nickname", component: UserProfileComponent, canActivate: [loginGuard] },
	{ path: "user-edit-profile/:nickname", component: UserProfileEditComponent, canActivate: [loginGuard, editableProfileGuard] },
	{ path: "create-user-profile", component: CreateUserProfileComponent, canActivate: [loginGuard] },,
	{ path: "chat", component: ChatComponent, canActivate: [loginGuard] },
	{ path: 'chat-rooms', component: ChatRoomsComponent, canActivate: [loginGuard] },
	{ path: 'chat-rooms/invite/:accessId', component: ChatRoomsComponent, canActivate: [loginGuard] },
	{ path: 'chat-room/:accessId', component: ChatRoomComponent, canActivate: [loginGuard] },
	{ path: '**', component: NotFoundComponent },
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule { }
