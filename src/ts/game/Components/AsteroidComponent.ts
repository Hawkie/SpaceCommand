import { DrawPolyGraphicAngled } from "../../gamelib/Views/PolyGraphicAngled";
import { DrawContext } from "../../gamelib/1Common/DrawContext";
import { IGraphic } from "../../gamelib/DataTypes/Graphic";
import { MoveWithVelocity } from "../../gamelib/Actors/Movers";
import { IShape, Shape } from "../../gamelib/DataTypes/Shape";
import { ICoordinate } from "../../gamelib/DataTypes/Coordinate";
import { Transforms } from "../../gamelib/Physics/Transforms";
import { IAsteroidShape, IAsteroidStateStatic } from "../States/Asteroids/AsteroidGameStatic";
import { RotatePoly, RotateShape } from "../../gamelib/Actors/Rotators";
import { Wrap } from "../../gamelib/Actors/Wrap";

export interface IAsteroid {
    x: number;
    y: number;
    Vx: number;
    Vy :number;
    angle:number;
    spin:number;
    size:number;
    type:number;
    shape: IShape;
    graphic: string;
}

    // 5 different asteroid shapes

export function CreateAsteroid(shapes: IAsteroidShape[], x: number, y: number, Vx: number, Vy:number, size: number): IAsteroid {
    let type:number = Transforms.random(0, 4);
    let points: number[] = shapes[type].points;
    let coords: ICoordinate[] = Transforms.ArrayToPoints(points);
    let scaledShape: ICoordinate[] = Transforms.Scale(coords, size, size);
    let shape: IShape = new Shape(scaledShape);
    let a: IAsteroid = {
        x: x,
        y: y,
        Vx: Vx + Transforms.random(-20, 20),
        Vy: Vy + Transforms.random(-20, 20),
        angle: Transforms.random(0, 359),
        spin:Transforms.random(-10, 10),
        size: size,
        type: type,
        shape: shape,
        graphic: "res/img/terrain.png",
    };
    return a;
}

export function CreateAsteroidData(asteroidStateStatic: IAsteroidStateStatic, size: number): IAsteroid {
    let xy: number = Transforms.random(0, 3);
    let x: number = Transforms.random(0,512), y: number = Transforms.random(0, 480);
    if (xy === 0) {
        x = Transforms.random(0, 100);
    } else if (xy === 1) {
        x = Transforms.random(412, 512);
    } else if (xy === 2) {
        y = Transforms.random(0, 100);
    } else if (xy === 3) {
        y = Transforms.random(380, 480);
    }
    return CreateAsteroid(asteroidStateStatic.shapes, x,y, 0, 0, size);
}

export function DisplayAsteroid(ctx: DrawContext, asteroid: IAsteroid, graphic: IGraphic): void {
    DrawPolyGraphicAngled(ctx, asteroid.x + asteroid.shape.offset.x,
        asteroid.y + asteroid.shape.offset.y,
        asteroid.shape,
        asteroid.angle,
        graphic);
}

export function UpdateAsteroid(timeModifier: number, asteroid: IAsteroid): IAsteroid {
    let moved: IAsteroid = MoveWithVelocity(timeModifier, asteroid, asteroid.Vx, asteroid.Vy);
    let spun: IAsteroid = RotateShape(timeModifier, moved, moved.spin);
    let wrapped: IAsteroid = Object.assign({}, spun, {
        x: Wrap(spun.x, 0, 512),
        y: Wrap(spun.y, 0, 480)
    });
    return wrapped;
}