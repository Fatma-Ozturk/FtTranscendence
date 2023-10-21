import { Component, ElementRef, OnInit, ViewChild, AfterViewInit, HostListener, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent {
  isArrowUpPressed: boolean;
  isArrowDownPressed: boolean;

  @ViewChild('messageInput') messageInputRef: ElementRef;
  @ViewChild('messagesContent') messagesContentRef: ElementRef;

  messageInput: string = "";
  messages: any[] = [];
  isTyping: boolean = false;
  fakeMessages = [
    'Hi there, I\'m Fabio and you?',
    'Nice to meet you',
    'How are you?',
  ];
  i: number = 0;

  constructor(private renderer: Renderer2) {

  }

  insertMessage(): void {
    let msg: string = this.messageInputRef.nativeElement.value as string;
    if (!msg.trim()) {
      return;
    }
    this.messageInput = msg;
    this.messagesContentRef.nativeElement.innerHTML = '<div class="message message-personal">' + msg + '</div>';
    this.messagesContentRef.nativeElement.querySelector(".mCSB_container");
    this.renderer.addClass(this.messagesContentRef, "message.new");
  }

  setDate() {
    const d = new Date();
    const timestamp = `${d.getHours()}:${d.getMinutes()}`;
    if (!this.messages.length || timestamp !== this.messages[this.messages.length - 1].timestamp) {
      this.messages.push({ text: timestamp, timestamp: timestamp });
    }
  }

  updateScrollbar() {
    const messagesContent = this.messagesContentRef.nativeElement;
    this.renderer.setProperty(messagesContent, 'scrollTop', messagesContent.scrollHeight);
  }

  keyDownEnter(){
    this.insertMessage();
    this.updateScrollbar();
  }
}
