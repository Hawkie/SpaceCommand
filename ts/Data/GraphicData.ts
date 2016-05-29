
export interface IGraphic {
    loaded: boolean;
    img: HTMLImageElement;
}

export class GraphicData implements IGraphic {

    loaded: boolean;
    img: HTMLImageElement;
    constructor(public src: string) {
        this.img = new Image();
        this.img.onload = (() => this.loaded = true).bind(this);
        this.img.src = src;
    }
}