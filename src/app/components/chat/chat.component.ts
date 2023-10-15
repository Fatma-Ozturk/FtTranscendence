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

  messageInput: string = '';
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

  insertMessage(): boolean {
    const msg: string = this.messageInputRef.nativeElement.value as string;
    if (msg.trim() === '') {
      return false;
    }
    return true;
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

  
  @HostListener('window:keydown', ['$event'])
	onKeyDown(event: KeyboardEvent) {
		if (event.key === 'ArrowUp' || event.key === 'w' || event.key === 'W') {
			this.isArrowUpPressed = true;
		} else if (
			event.key === 'ArrowDown' ||
			event.key === 's' ||
			event.key === 'S'
		) {
			this.isArrowDownPressed = true;
		}
	}

	@HostListener('window:keyup', ['$event'])
	onKeyUp(event: KeyboardEvent) {
		if (event.key === 'ArrowUp' || event.key === 'w' || event.key === 'W') {
			this.isArrowUpPressed = false;
		} else if (
			event.key === 'ArrowDown' ||
			event.key === 's' ||
			event.key === 'S'
		) {
			this.isArrowDownPressed = false;
		}
	}
}
