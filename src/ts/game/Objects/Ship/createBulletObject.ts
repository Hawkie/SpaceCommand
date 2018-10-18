import { IView } from "ts/gamelib/Views/View";
import { RectangleView } from "ts/gamelib/Views/RectangleView";
import { MoveConstVelocity, IMoveOut } from "ts/gamelib/Actors/Movers";
import { SingleGameObject } from "ts/gamelib/GameObjects/SingleGameObject";
import { IActor } from "ts/gamelib/Actors/Actor";
import { IParticle } from "ts/game/Objects/Particle/IParticle";
import { Sound } from "ts/gamelib/Actors/Sound";

export function createBulletObject(getParticle: () => IParticle): SingleGameObject {
    let particle: IParticle = getParticle();
    let mover: IActor = new MoveConstVelocity(() => particle, (out: IMoveOut) => {
        particle.x += out.dx;
        particle.y += out.dy;
    });
    let view: IView = new RectangleView(() => {
        return {
            x: particle.x,
            y: particle.y,
            width: particle.size,
            height: particle.size,
        };
    });
    let particleObj: SingleGameObject = new SingleGameObject([mover], [view]);
    let fireSound: IActor = new Sound("res/sound/raygun-01.mp3", true, false, () => {
        return {
            play: true,
        };
    });
    particleObj.actors.push(fireSound);
    return particleObj;
}