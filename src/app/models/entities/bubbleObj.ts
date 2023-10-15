export class BubbleObj {
    text: string;
    w: number;
    x: number;
    y: number;

    constructor(text: string, w: number, x: number, y: number) {
        const minW = 35;
        this.text = text;
        this.w = w < minW ? minW : w;
        this.x = x;
        this.y = y;
    }
}