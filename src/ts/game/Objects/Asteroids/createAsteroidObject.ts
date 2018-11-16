import { IAsteroid } from "../../States/Asteroids/createAsteroidData";
import { IView } from "../../../gamelib/Views/View";
import { PolyGraphicAngledView } from "../../../gamelib/Views/PolyGraphicAngled";
import { MoveConstVelocity, IMoveOut } from "../../../gamelib/Actors/Movers";
import { SingleGameObject } from "../../../gamelib/GameObjects/SingleGameObject";
import { IActor } from "../../../gamelib/Actors/Actor";
import { PolyRotator } from "../../../gamelib/Actors/Rotators";
import { Spinner } from "../../../gamelib/Actors/Spinner";
import { IShape } from "../../../gamelib/DataTypes/Shape";
import { createWrapActor } from "../../../gamelib/Actors/Wrap";

// creates a graphical view asteroid with and spin, velocity
export function createAsteroidObject(getAsteroid: () => IAsteroid): SingleGameObject {
    let asteroid: IAsteroid = getAsteroid();
    let mover: IActor = new MoveConstVelocity(() => {
        return {
            Vx: asteroid.Vx,
            Vy: asteroid.Vy,
        };
    }, (out: IMoveOut) => {
        asteroid.x += out.dx;
        asteroid.y += out.dy;
    });
    let spinner: IActor = new Spinner(() => {
        return { spin: asteroid.spin };
    }, (sOut) => asteroid.angle += sOut.dAngle);
    let rotator: IActor = new PolyRotator(() => {
        return {
            angle: asteroid.angle,
            shape: asteroid.shape,
        };
    }, (out: IShape) => {
        asteroid.shape = out;
    });
    let wrapx: IActor = createWrapActor(() => {
        return {
            value: asteroid.x,
            lowLimit: 0,
            upLimit: 512,
        };
    }, (a) => asteroid.x = a);
    let wrapy: IActor = createWrapActor(() => {
        return {
            value: asteroid.y,
            lowLimit: 0,
            upLimit: 480,
        };
    }, (a) => asteroid.y = a);
    let view: IView = new PolyGraphicAngledView(() => {
        return {
            x: asteroid.x,
            y: asteroid.y,
            shape: asteroid.shape,
            graphic: asteroid.graphic,
            angle: asteroid.angle,
        };
    });
    let asteroidObject: SingleGameObject = new SingleGameObject([mover, spinner, rotator, wrapx, wrapy], [view]);
    return asteroidObject;
}