import { MultiGameObject } from "ts/gamelib/GameObjects/MultiGameObject";
import { SingleGameObject } from "ts/gamelib/GameObjects/SingleGameObject";
import { IActor } from "ts/gamelib/Actors/Actor";
import { Coordinate } from "ts/gamelib/DataTypes/Coordinate";
import { createParticleField } from "ts/game/Objects/Particle/createParticleField";
import { Sound } from "ts/gamelib/Actors/Sound";
import { Transforms } from "ts/gamelib/Physics/Transforms";
import { IShip } from "./IShip";
export function createExhaustObj(getShip: () => IShip): MultiGameObject<SingleGameObject> {
    var ship: IShip = getShip();
    var exhaustObj: MultiGameObject<SingleGameObject> = createParticleField(ship.exhaust.exhaustParticleField, () => {
        var velocity: Coordinate = Transforms.VectorToCartesian(ship.thrust.angle + Transforms.random(-5, 5) + 180,
        ship.thrust.length * 5 + Transforms.random(-5, 5));
        return {
            on: ship.exhaust.exhaustParticleField.on,
            x: ship.x,
            xOffset: ship.shape.offset.x,
            xLowSpread: -2,
            xHighSpread: 2,
            y: ship.y,
            yOffset: ship.shape.offset.y,
            yLowSpread: -2,
            yHighSpread: 2,
            Vx: velocity.x,
            vXLowSpread: 0,
            vXHighSpread: 0,
            Vy: velocity.y,
            vYLowSpread: 0,
            vYHighSpread: 0,
        };
    });
    var exhaustSound: IActor = new Sound(ship.exhaust.soundFilename, false, true, () => {
        return {
            play: ship.exhaust.exhaustParticleField.on,
        };
    });
    exhaustObj.actors.push(exhaustSound);
    return exhaustObj;
}