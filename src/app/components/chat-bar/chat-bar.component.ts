import { Component, Renderer2, RendererFactory2 } from '@angular/core';
import { ChatBarObj } from 'src/app/models/entities/chatEntities/chatBarObj';

@Component({
  selector: 'app-chat-bar',
  templateUrl: './chat-bar.component.html',
  styleUrls: ['./chat-bar.component.css'],
})
export class ChatBarComponent {

  private renderer: Renderer2;
  private chatBarObj: ChatBarObj;

  constructor(private rendererFactory: RendererFactory2) {
    this.renderer = this.rendererFactory.createRenderer(null, null);
    this.chatBarObj = new ChatBarObj();
    this.create();
  }

  create() {
    const form = this.renderer.createElement('form');
    const field = this.renderer.createElement('input');
    const btn1 = this.renderer.createElement('button');
    const btn2 = this.renderer.createElement('button');
    const log = this.renderer.createElement('div');

    // set up form elements and translate them to inside canvas
    this.renderer.setAttribute(form, 'action', '');
    this.renderer.setStyle(form, 'padding', this.chatBarObj.margin + 'px');
    //this.renderer.setStyle(form, 'width', this.canvas.width / this.s + 'px');
    this.renderer.setStyle(form, 'width', 568 + 'px');
    this.renderer.setStyle(form, 'height', this.chatBarObj.barH + 'px');
    this.renderer.setStyle(form, 'transform', 'translateY(' + -this.chatBarObj.barH + 'px)');
    // text input
    this.renderer.setAttribute(field, 'type', 'text');
    this.renderer.setStyle(field, 'fontSize', this.chatBarObj.barH * 0.4 + 'px');
    this.renderer.setStyle(field, 'height', this.chatBarObj.barH - this.chatBarObj.margin * 2 + 'px');
    this.renderer.setStyle(field, 'padding', '0 ' + this.chatBarObj.margin + 'px');
    this.renderer.setAttribute(field, 'maxLength', '64');
    // send button
    this.renderer.addClass(btn1, 'send');
    this.renderer.setStyle(btn1, 'fontSize', this.chatBarObj.barH * 0.4 + 'px');
    this.renderer.setStyle(btn1, 'height', this.chatBarObj.barH - this.chatBarObj.margin * 2 + 'px');
    // view chat button
    this.renderer.addClass(btn2, 'view-chat');
    this.renderer.setStyle(btn2, 'fontSize', this.chatBarObj.barH * 0.25 + 'px');
    this.renderer.setStyle(btn2, 'height', this.chatBarObj.barH - this.chatBarObj.margin * 2 + 'px');

    // chat log
    this.renderer.addClass(log, 'chat-log');
    //this.renderer.setStyle(log, 'width', this.canvas.width / this.s + 'px');
    this.renderer.setStyle(log, 'width', 568 + 'px');
    this.renderer.setStyle(log, 'height', this.chatBarObj.logH + 'px');
    this.renderer.setStyle(log, 'transform', 'translateY(' + (-this.chatBarObj.barH * 2 - this.chatBarObj.logH) + 'px)');
    this.renderer.setStyle(log, 'padding', this.chatBarObj.margin + 'px');

    // Append elements to the document body
    this.renderer.appendChild(document.body, form);
    this.renderer.appendChild(document.body, log);
    this.renderer.appendChild(form, field);
    this.renderer.appendChild(form, btn1);
    this.renderer.appendChild(form, btn2);
    this.renderer.appendChild(btn1, this.renderer.createText('Send'));
    this.renderer.appendChild(btn2, this.renderer.createText('View Chat'));
  }

}
