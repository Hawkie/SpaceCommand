import { DrawContext } from "ts/Common/DrawContext";
import { ILocated, ILocatedMoving, IMoving, IAngled, ILocatedAngledMoving, IShapeLocatedAngled, IShape } from "ts/Models/PolyModels";
import { IParticleFieldData } from "ts/Models/ParticleFieldModel";
import { IDrawable } from "ts/DisplayObjects/DisplayObject";
import { Coordinate } from "ts/Physics/Common";


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

export class LocatedData implements ILocated {
    constructor(public location: Coordinate) { }
}

export class LocatedMovingData extends LocatedData implements IMoving {
    constructor(location: Coordinate, public velX: number, public velY: number) {
        super(location);
    }
}

export class LocatedMovingAngledData extends LocatedMovingData implements IAngled {
    constructor(location: Coordinate, velX: number, velY: number, public angle:number) {
        super(location, velX, velY);
    }
}



export class Sprite {
}