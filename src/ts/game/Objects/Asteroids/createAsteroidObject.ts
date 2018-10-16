import { IAsteroid } from "../../States/Asteroids/createAsteroidData";
import { IView } from "ts/gamelib/Views/View";
import { PolyGraphicAngled } from "ts/gamelib/Views/PolyGraphicAngled";
import { MoveConstVelocity, IMoveOut } from "ts/gamelib/Actors/Movers";
import { SingleGameObject } from "ts/gamelib/GameObjects/SingleGameObject";
import { IActor } from "ts/gamelib/Actors/Actor";
import { PolyRotator } from "ts/gamelib/Actors/Rotators";
import { Spinner } from "ts/gamelib/Actors/Spinner";
import { IShape } from "ts/gamelib/Data/Shape";
import { createWrapActor } from "ts/gamelib/Actors/Wrap";

// creates a graphical view asteroid with and spin, velocity
export function createAsteroidObject(getAsteroid: () => IAsteroid): SingleGameObject {
    var asteroid: IAsteroid = getAsteroid();
    var mover: IActor = new MoveConstVelocity(() => {
        return {
            Vx: asteroid.Vx,
            Vy: asteroid.Vy,
        };
    }, (out: IMoveOut) => {
        asteroid.x += out.dx;
        asteroid.y += out.dy;
    });
    var spinner: IActor = new Spinner(() => {
        return { spin: asteroid.spin };
    }, (sOut) => asteroid.angle += sOut.dAngle);
    var rotator: IActor = new PolyRotator(() => {
        return {
            angle: asteroid.angle,
            shape: asteroid.shape,
        };
    }, (out: IShape) => {
        asteroid.shape = out;
    });
    var wrapx: IActor = createWrapActor(() => {
        return {
            value: asteroid.x,
            lowLimit: 0,
            upLimit: 512,
        };
    }, (a) => asteroid.x = a);
    var wrapy: IActor = createWrapActor(() => {
        return {
            value: asteroid.y,
            lowLimit: 0,
            upLimit: 480,
        };
    }, (a) => asteroid.y = a);
    var view: IView = new PolyGraphicAngled(() => {
        return {
            x: asteroid.x,
            y: asteroid.y,
            shape: asteroid.shape,
            graphic: asteroid.graphic,
            angle: asteroid.angle,
        };
    });
    var asteroidObject: SingleGameObject = new SingleGameObject([mover, spinner, rotator, wrapx, wrapy], [view]);
    return asteroidObject;
}