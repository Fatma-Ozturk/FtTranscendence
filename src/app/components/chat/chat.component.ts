import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { ChatRoomMessageModel } from './../../models/model/chatRoomMessageModel';
import { Component, ElementRef, OnInit, ViewChild, AfterViewInit, HostListener, Renderer2, Input, EventEmitter, Output, SimpleChanges, OnChanges } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnChanges, AfterViewInit {
  currentNickName: string;
  currentFullName: string;
  isArrowUpPressed: boolean;
  isArrowDownPressed: boolean;

  message: string = "";
  changeMessages: boolean = false;

  profileImageUrl: string;

  @Input() chatRoomAccessId: string;
  @Input() messages: any[];
  @ViewChild('messagesContent') messagesContentRef: ElementRef;
  @Output() messageInput = new EventEmitter<string>();
  @Output() sendMessageClickOutput = new EventEmitter<any>();
  @Output() updateScrollbarOutput = new EventEmitter<any>();

  constructor(
    private renderer: Renderer2,
    private authService: AuthService,
    private toastrService: ToastrService,
    private router: Router) {

  }

  ngOnInit() {
    this.currentNickName = this.authService.getCurrentNickName();
    this.currentFullName = this.authService.getCurrentFullName();
    this.profileImageUrl = environment.profileImageUrl;
  }

  ngAfterViewInit(): void {
    this.updateScrollbar();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['messages']) {
      const prevValue = changes['messages'].previousValue;
      const currentValue = changes['messages'].currentValue;

      if (prevValue !== currentValue) {
        this.changeMessages = true;
        setTimeout(() => {
          this.changeMessages = false;
        }, 100);
      }
    }
  }

  updateScrollbar() {
    try {
      this.updateScrollbarOutput.emit(this.messagesContentRef);
      const messagesContent = this.messagesContentRef.nativeElement;
      const scrollToOptions: ScrollToOptions = {
        top: messagesContent.scrollHeight,
        left: 0,
        behavior: "smooth",
      };
      this.renderer.setProperty(messagesContent, 'scrollTop', messagesContent.scrollHeight);
      messagesContent.scrollTo(scrollToOptions);
    } catch (error) {
      console.error(error);
    }
  }

  sendMessage() {
    this.messageInput.emit(this.message);
    this.sendMessageClickOutput.emit();
    this.message = "";
    setTimeout(() => {
      this.updateScrollbar();
    }, 100);
  }

  navigateProfile(message: ChatRoomMessageModel) {
    this.router.navigate(['/user-profile', message.sender]);
  }

  navigateMyProfile() {
    this.router.navigate(['/user-profile', this.currentNickName]);
  }

  gameInvate(hostUserNickName: string, guestUserNickName: string) {
    this.router.navigate(['/game-matchmaking//two-user'], { queryParams: { hostUserNickName: hostUserNickName, guestUserNickName: guestUserNickName } });
  }
}
