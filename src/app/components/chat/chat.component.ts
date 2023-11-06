import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { ChatRoomMessageModel } from './../../models/model/chatRoomMessageModel';
import { Component, ElementRef, OnInit, ViewChild, AfterViewInit, HostListener, Renderer2, Input, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent {
  currentNickName: string;
  isArrowUpPressed: boolean;
  isArrowDownPressed: boolean;

  message: string = "";

  @Input() chatRoomAccessId: string;
  @Input() messages: ChatRoomMessageModel[];
  @ViewChild('messagesContent') messagesContentRef: ElementRef;
  @Output() messageInput = new EventEmitter<string>();
  @Output() sendMessageClickOutput = new EventEmitter<any>();


  constructor(
    private renderer: Renderer2,
    private authService: AuthService,
    private toastrService: ToastrService) {

  }

  ngOnInit(){
    this.currentNickName = this.authService.getCurrentNickName();
  }

  updateScrollbar() {
    try {
      const messagesContent = this.messagesContentRef.nativeElement;
      this.renderer.setProperty(messagesContent, 'scrollTop', messagesContent.scrollHeight); 
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
}
