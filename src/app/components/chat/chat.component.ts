import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  @ViewChild('chatHistory') private chatHistory!: ElementRef;
  @ViewChild('messageToSend') private messageToSend!: ElementRef;
  messageResponses: string[] = [
    'Why did the web developer leave the restaurant? Because of the table layout.',
    'How do you comfort a JavaScript bug? You console it.',
    'An SQL query enters a bar, approaches two tables and asks: "May I join you?"',
    'What is the most used language in programming? Profanity.',
    'What is the object-oriented way to become wealthy? Inheritance.',
    'An SEO expert walks into a bar, bars, pub, tavern, public house, Irish pub, drinks, beer, alcohol'
  ];
  chatHistoryList: HTMLUListElement | undefined;
  messageToSendText: string = '';

  constructor() { }

  ngOnInit(): void {
    this.cacheDOM();
  }

  cacheDOM(): void {
    this.chatHistoryList = this.chatHistory.nativeElement.querySelector('ul');
  }

  render(): void {
    this.scrollToBottom();
    if (this.messageToSendText.trim() !== '') {
      const template = `
        <li class="message new">
          <figure class="avatar">
            <img src="assets/user.svg" />
          </figure>
          <div class="message-text">${this.messageToSendText}</div>
          <div class="timestamp">${this.getCurrentTime()}</div>
        </li>
      `;
      this.chatHistoryList?.insertAdjacentHTML('beforeend', template);
      this.scrollToBottom();

      // responses
      const response = this.getRandomItem(this.messageResponses);
      const templateResponse = `
        <li class="message message-personal">
          <figure class="avatar">
            <img src="assets/bot.svg" />
          </figure>
          <div class="message-text">${response}</div>
          <div class="timestamp">${this.getCurrentTime()}</div>
        </li>
      `;
      setTimeout(() => {
        this.chatHistoryList?.insertAdjacentHTML('beforeend', templateResponse);
        this.scrollToBottom();
      }, 1500);

      this.messageToSendText = '';
    }
  }

  addMessage(): void {
    this.messageToSendText = this.messageToSend.nativeElement.value;
    this.render();
  }

  addMessageEnter(event: KeyboardEvent): void {
    if (event.keyCode === 13) {
      this.addMessage();
    }
  }

  scrollToBottom(): void {
    this.chatHistory.nativeElement.scrollTop = this.chatHistory.nativeElement.scrollHeight;
  }

  getCurrentTime(): string {
    return new Date().toLocaleTimeString()
      .replace(/([\d]+:[\d]{2})(:[\d]{2})(.*)/, "$1$3");
  }

  getRandomItem(arr: string[]): string {
    return arr[Math.floor(Math.random() * arr.length)];
  }
}
