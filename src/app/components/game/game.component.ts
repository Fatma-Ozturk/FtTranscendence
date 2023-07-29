import { PaddleGameModel } from './../../models/model/paddleGameModel';
import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { BallGameModel } from 'src/app/models/model/ballGameModel';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent {
  screenHeight: number;
  screenWidth: number;

  @ViewChild('gameCanvas', { static: true }) canvasRef: ElementRef<HTMLCanvasElement>;
  context: CanvasRenderingContext2D;

  ball: BallGameModel;

  paddleHost: PaddleGameModel;
  paddleGuest: PaddleGameModel;

  static playerHostScore: number = 0;
  static playerGuestScore: number = 0;

  isArrowUpPressed: boolean = false;
  isArrowDownPressed: boolean = false;

  constructor() {
  }

  ngAfterViewInit(): void {
    this.context = this.canvasRef.nativeElement.getContext('2d');
    this.gameDraw();
  }

  ngOnInit(): void {
    this.getScreenSize();
  }

  private gameDraw(): void {
    this.context.fillStyle = 'blue';
    this.canvasRef.nativeElement.height = this.screenHeight - 200;
    this.canvasRef.nativeElement.width = this.screenWidth - 100;
    this.context.fillRect(0, 0, 10, 10);
  }

  gameLoop(): void {
		this.gameUpdate();
		this.gameDraw();
		setTimeout(() => {
			window.requestAnimationFrame(this.gameLoop);
		}, 10);
  }

  gameUpdate(): void {

  }

  paddleUpdateHost(): void {

  }

  paddleUpdateGuest(): void {

  }

  updateBall(): void {

  }

  playerHostDraw(): void {

  }

  playerGuestDraw(): void {

  }

  ballDraw(): void {

  }

  @HostListener('window:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'ArrowUp') {
      this.isArrowUpPressed = true;
      console.log("arrow up");
    } else if (event.key === 'ArrowDown') {
      this.isArrowDownPressed = true;
      console.log("arrow down");
    }
  }

  // Listen for keyup event on the window
  @HostListener('window:keyup', ['$event'])
  onKeyUp(event: KeyboardEvent) {
    if (event.key === 'ArrowUp') {
      this.isArrowUpPressed = false;
    } else if (event.key === 'ArrowDown') {
      this.isArrowDownPressed = false;
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.getScreenSize();
  }

  getScreenSize() {
    this.screenWidth = window.innerWidth;
    this.screenHeight = window.innerHeight;
  }
}
