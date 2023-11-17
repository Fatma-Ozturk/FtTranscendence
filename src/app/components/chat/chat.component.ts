import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { ChatRoomMessageModel } from './../../models/model/chatRoomMessageModel';
import { Component, ElementRef, OnInit, ViewChild, AfterViewInit, HostListener, Renderer2, Input, EventEmitter, Output, SimpleChanges, OnChanges } from '@angular/core';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnChanges, AfterViewInit {
  currentNickName: string;
  isArrowUpPressed: boolean;
  isArrowDownPressed: boolean;

  message: string = "";
  changeMessages: boolean = false;

  @Input() chatRoomAccessId: string;
  @Input() messages: ChatRoomMessageModel[];
  @ViewChild('messagesContent') messagesContentRef: ElementRef;
  @Output() messageInput = new EventEmitter<string>();
  @Output() sendMessageClickOutput = new EventEmitter<any>();
  @Output() updateScrollbarOutput = new EventEmitter<any>();


  constructor(
    private renderer: Renderer2,
    private authService: AuthService,
    private toastrService: ToastrService,
    private router:Router) {

  }

  ngOnInit() {
    this.currentNickName = this.authService.getCurrentNickName();
  }
  
  ngAfterViewInit(): void {
    this.updateScrollbar();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['messages']) {
      // console.log("message change ");

      const prevValue = changes['messages'].previousValue;
      const currentValue = changes['messages'].currentValue;

      if (prevValue !== currentValue) {
        this.changeMessages = true;
        setTimeout(() => {
          this.changeMessages = false;
        }, 100);
      }
      // console.log(`Previous Value: ${prevValue}, Current Value: ${currentValue}`);
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
  
      console.log("messagesContent.scrollHeight ", messagesContent.scrollHeight);
      console.log("messagesContent.scrollTop ", messagesContent.scrollTop);
      
      console.log("ok ok ok scrollTop");
    } catch (error) {
      console.log(error);
    }
  }

  sendMessage() {
    this.messageInput.emit(this.message);
    this.sendMessageClickOutput.emit();
    this.updateScrollbar();
    this.message = "";
  }

  navigateProfile(message: ChatRoomMessageModel){
    this.router.navigate(['/user-profile', message.sender]);
  }
}
