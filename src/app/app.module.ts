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
import { LeaderboardComponent } from './components/leaderboard/leaderboard.component';
import { ChatComponent } from './components/chat/chat.component';
import { GameComponent } from './components/game/game.component';
import { ButtonModule } from 'primeng/button';

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
    LeaderboardComponent,
    ChatComponent,
    GameComponent
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
    RippleModule,
    AutoFocusModule,
    InputSwitchModule,
    ButtonModule,
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