import { Component, ElementRef, OnInit } from '@angular/core';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit{
  ex = 10;
  inter: number | null = null;

  constructor(private elementRef: ElementRef) {}

  ngOnInit() {
    const start = this.elementRef.nativeElement.querySelector('#brand');
    const start_button = start.querySelector('button');
    const og_color = start_button.style.color;

    this.swing(start);

    start.addEventListener('mouseover', (_e: any) => {
      this.ex = 20;
      this.inter = setInterval(() => {  
        start_button.style.color = '#' + Math.floor(Math.random() * 16777215).toString(16);
      }, 1000) as any;
    });

    start.addEventListener('mouseout', (_e: any) => {
      this.ex = 10;
      clearInterval(this.inter);
      start_button.style.color = og_color; 
    });
  }

  swing = (element: HTMLElement) => {
    const update = (time: number ) => {
      const x = Math.sin(time / 1231) * this.ex;
      const y = Math.sin(time / 1458) * this.ex;
      element.style.transform = [`rotateX(${x}deg)`, `rotateY(${y}deg)`].join(' ');
      requestAnimationFrame(update);
    };
    update(0);
  }
}
