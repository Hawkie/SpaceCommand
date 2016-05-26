import { ILocatedMoving, ILocatedAngled, ILocatedAngledMoving, IShapeLocated, IShapeLocatedMoving, IShapeLocatedAngledMovingRotataing, IShapeLocatedAngledMovingRotataingAccelerating } from "../Models/PolyModels";
import { TextData } from "ts/Models/TextModel";
import { IActor } from "ts/Actors/Actor";
import { Mover } from "ts/Actors/Movers";
import { Coordinate, Vector } from "ts/Physics/Common";
import { PolyRotator, Spinner } from "ts/Actors/Rotators";
import { ForwardAccelerator, VectorAccelerator } from "ts/Actors/Accelerators";
import { Transforms } from "ts/Physics/Transforms";

export interface IModel<TData> extends IActor {
    data: TData;
}

export class DynamicModel<TData> implements IModel<TData>, IActor {
    constructor(public data: TData, private actors: IActor[] = []) {
    }

    update(timeModifier: number) {
        this.actors.forEach(a => a.update(timeModifier));
    }
}


export class ShapeMovingModel<TData extends IShapeLocatedMoving> extends DynamicModel<TData> {
    constructor(data: TData, actors: IActor[] = []) {
        var mover: IActor = new Mover(data);
        actors.push(mover);
        super(data, actors);
    }
}

export class AngledModel<TData extends ILocatedAngled> extends DynamicModel<TData> {
    constructor(data: TData, actors: IActor[] = []) {
        //var mover: IActor = new Mover(data);
        //actors.push(mover);
        super(data);
    }
}

export class AngledMovingModel<TData extends ILocatedAngledMoving> extends DynamicModel<TData> {
    constructor(data: TData, actors: IActor[] = []) {
        //var mover: IActor = new Mover(data);
        //actors.push(mover);
        super(data);
    }
}

export class MovingModel<TData extends ILocatedMoving> extends DynamicModel<TData> {
    constructor(data: TData, actors: IActor[] = []) {
        var mover: IActor = new Mover(data);
        actors.push(mover);
        super(data, actors);
    }
}

export class MovingGravityModel<TData extends ILocatedMoving> extends DynamicModel<TData> {
    constructor(data: TData, actors: IActor[] = []) {
        var mover: IActor = new Mover(data);
        var vectorAccelerator = new VectorAccelerator(data, new Vector(180, 10));
        actors.push(mover, vectorAccelerator);
        super(data, actors);
    }
}

export class ShapeMovingSpinningModel<TData extends IShapeLocatedAngledMovingRotataing> extends DynamicModel<TData> {
    constructor(data: TData, actors: IActor[] = []) {
        var mover: IActor = new Mover(data);
        var spinner: IActor = new Spinner(data);
        var rotator = new PolyRotator(data);
        actors.push(mover, spinner, rotator);
        super(data, actors);
    }
}

export class ShapeMovingThrustingModel<TData extends IShapeLocatedAngledMovingRotataingAccelerating> extends DynamicModel<TData> {
    constructor(data: TData, actors: IActor[] = []) {
        var mover: IActor = new Mover(data);
        var thrust = new ForwardAccelerator(data);
        var rotator = new PolyRotator(data);
        actors.push(mover, thrust, rotator);
        super(data, actors);
    }
}