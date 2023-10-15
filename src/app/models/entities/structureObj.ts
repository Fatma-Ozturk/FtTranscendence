export class StructureObj {
    w: number;
    h: number;
    x: number;
    y: number;
    backArea: number;
    img: HTMLImageElement | null;
    isAnim: boolean;
    frames: number;
    curFrame: number;

    constructor(
        width: number,
        height: number,
        x: number,
        y: number,
        backArea: number,
        img: HTMLImageElement | null,
        isAnim: boolean,
        frames: number
    ) {
        this.w = width;
        this.h = height;
        this.x = x;
        this.y = y;
        this.backArea = backArea || 0;
        this.img = img || null;
        this.isAnim = img && isAnim ? (typeof isAnim == "boolean" ? true : false) : false;
        this.frames = frames || 1;
        this.curFrame = 1;
    }
}
