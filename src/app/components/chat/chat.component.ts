import { Component, ElementRef, OnInit, ViewChild, AfterViewInit, HostListener } from '@angular/core';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements AfterViewInit, OnInit {
  screenHeight: number;
  screenWidth: number;

  @ViewChild('gameCanvas', { static: true }) canvasRef: ElementRef<HTMLCanvasElement>;
  context: CanvasRenderingContext2D;

  isArrowUpPressed: boolean = false;
  isArrowDownPressed: boolean = false;

  sprites = [
    "https://i.ibb.co/TqMC0Dp/grass.png",
    "https://i.ibb.co/GTsDmJF/fountain.png",
    "https://i.ibb.co/59SRcxm/chibi-m.png",
    "https://i.ibb.co/PChphHS/chibi-f.png"
  ];
  images:any = [];

  constructor() { }

  ngAfterViewInit(): void {
    this.context = this.canvasRef.nativeElement.getContext('2d');
    this.gameDraw();
    this.loadImages();
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

  private loadImages(): void {
    for (const sprite of this.sprites) {
      const image = new Image();
      image.src = sprite;
      this.images.push(image);
    }
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
