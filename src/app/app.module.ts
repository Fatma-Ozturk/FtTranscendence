import { CreateUserProfileComponent } from './components/create-user-profile/create-user-profile.component';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ToastrModule } from 'ngx-toastr';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { InputSwitchModule } from 'primeng/inputswitch';
import { AutoFocusModule } from 'primeng/autofocus';
import { CardModule } from 'primeng/card';
import { AccordionModule } from 'primeng/accordion';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from "@angular/forms"
import { ToastModule } from 'primeng/toast';
import { JwtModule } from "@auth0/angular-jwt";
import { KnobModule } from 'primeng/knob';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { MenubarModule } from 'primeng/menubar';
import { SidebarModule } from 'primeng/sidebar';
import { ChipModule } from 'primeng/chip';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { DropdownModule } from 'primeng/dropdown';
import { TabViewModule } from 'primeng/tabview';
import { DialogModule } from 'primeng/dialog';
import { ChipsModule } from 'primeng/chips';
import { GalleriaModule } from 'primeng/galleria';
import { PaginatorModule } from 'primeng/paginator';
import { CarouselModule } from 'primeng/carousel';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputMaskModule } from 'primeng/inputmask';
import { CalendarModule } from 'primeng/calendar';
import { TooltipModule } from 'primeng/tooltip';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { MultiSelectModule } from 'primeng/multiselect';
import { NgxSpinnerModule } from "ngx-spinner";
import { TimelineModule } from 'primeng/timeline';
import { SpeedDialModule } from 'primeng/speeddial';
import { RatingModule } from 'primeng/rating';
import { RippleModule } from 'primeng/ripple';
import { FieldsetModule } from 'primeng/fieldset';
import { CookieService } from 'ngx-cookie-service';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { MyHttpLoadInterceptor } from './interceptors/my-http-load.interceptor';
import { HttpErrorInterceptor } from './interceptors/http-error.interceptor';
import { ConfirmationService } from 'primeng/api';
import { FooterComponent } from './components/footer/footer.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { MainComponent } from './components/main/main.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { ViewComponent } from './components/view/view.component';
import { UserActivateComponent } from './components/user-activate/user-activate.component';
import { Auth42Component } from './components/auth42/auth42.component';
import { RedirectionAuth42Component } from './components/redirection-auth42/redirection-auth42.component';
import { LeaderboardComponent } from './components/leaderboard/leaderboard.component';
import { ChatComponent } from './components/chat/chat.component';
import { GameComponent } from './components/game/game.component';
import { AuthGoogleComponent } from './components/auth-google/auth-google.component';
import { RedirectionAuthGoogleComponent } from './components/redirection-auth-google/redirection-auth-google.component';
import { ChatRoomComponent } from './components/chat-room/chat-room.component';
import { ChatRoomsComponent } from './components/chat-rooms/chat-rooms.component';
import { SearchUsersComponent } from './components/search-users/search-users.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { UserProfileCardComponent } from './components/user-profile-card/user-profile-card.component';
import { UserProfileEditComponent } from './components/user-profile-edit/user-profile-edit.component';
import { GameMatchmakingComponent } from './components/game-matchmaking/game-matchmaking.component';
import { ProgressBarModule } from 'primeng/progressbar';
import { ToolbarModule } from 'primeng/toolbar';
import { BadgeModule } from 'primeng/badge';
import { CheckboxModule } from 'primeng/checkbox';
import { PasswordModule } from 'primeng/password';
import { ChatRoomCreateComponent } from './components/chat-room-create/chat-room-create.component';
import { TagModule } from 'primeng/tag';
import { PanelMenuModule } from 'primeng/panelmenu';
import { SelectButtonModule } from 'primeng/selectbutton';
import { DirectMessageComponent } from './components/direct-message/direct-message.component';
import { UserTwoFAComponent } from './components/user-two-fa/user-two-fa.component';
import { MainContainerComponent } from './container/main-container/main-container.component';
import { UserTwoFAContainerComponent } from './container/user-two-facontainer/user-two-facontainer.component';
import { UserLoginContainerComponent } from './container/user-login-container/user-login-container.component';

@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    NavbarComponent,
    LoginComponent,
    RegisterComponent,
    MainComponent,
    NotFoundComponent,
    SidebarComponent,
    ViewComponent,
    UserActivateComponent,
    Auth42Component,
    RedirectionAuth42Component,
    LeaderboardComponent,
    ChatComponent,
    GameComponent,
    AuthGoogleComponent,
    RedirectionAuthGoogleComponent,
    ChatRoomComponent,
    ChatRoomsComponent,
    SearchUsersComponent,
    UserProfileComponent,
    UserProfileCardComponent,
    UserProfileEditComponent,
    CreateUserProfileComponent,
    GameMatchmakingComponent,
    ChatRoomCreateComponent,
    DirectMessageComponent,
    UserTwoFAComponent,
    MainContainerComponent,
    UserTwoFAContainerComponent,
    UserLoginContainerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AccordionModule,
    RouterModule,
    CommonModule,
    FormsModule,
    JwtModule,
    HttpClientModule,
    ReactiveFormsModule,
    KnobModule,
    TableModule,
    InputTextModule,
    DropdownModule,
    MenubarModule,
    SidebarModule,
    ChipModule,
    InputTextareaModule,
    ConfirmDialogModule,
    AvatarGroupModule,
    AvatarModule,
    TabViewModule,
    DialogModule,
    GalleriaModule,
    CarouselModule,
    NgxSpinnerModule,
    PaginatorModule,
    InputNumberModule,
    InputMaskModule,
    CalendarModule,
    TooltipModule,
    MessagesModule,
    MessageModule,
    MultiSelectModule,
    TimelineModule,
    SpeedDialModule,
    RatingModule,
    CardModule,
	FieldsetModule,
    RippleModule,
    AutoFocusModule,
    InputSwitchModule,
    ToastModule,
    ChipsModule,
    ProgressBarModule,
    ToolbarModule,
    BadgeModule,
    CheckboxModule,
    PasswordModule,
    TagModule,
    PanelMenuModule,
    SelectButtonModule,
    ToastrModule.forRoot({
      positionClass: "toast-bottom-center",
      timeOut: 10000,
    })
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MyHttpLoadInterceptor,
      multi: true,
    }, {
      provide: HTTP_INTERCEPTORS,
      multi: true,
      useClass: HttpErrorInterceptor
    }, ConfirmationService, CookieService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
