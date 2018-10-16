import { IView } from "ts/gamelib/Views/View";
import { IActor } from "ts/gamelib/Actors/Actor";
import { MoveConstVelocity, IMoveOut } from "ts/gamelib/Actors/Movers";
import { RectangleView } from "ts/gamelib/Views/RectangleView";
import { SingleGameObject } from "ts/gamelib/GameObjects/SingleGameObject";
import { IParticle } from "./IParticle";

// creates a constantly moving particle with rectangle shape
export function createParticleObject(p: IParticle): SingleGameObject {
    var mover: IActor = new MoveConstVelocity(() => {
        return {
            Vx: p.Vx,
            Vy: p.Vy,
        };
    }, (out: IMoveOut) => {
        p.x += out.dx;
        p.y += out.dy;
    });
    var view: IView = new RectangleView(() => {
        return {
            x: p.x,
            y: p.y,
            width: p.size,
            height: p.size,
        };
    });
    var newParticle: SingleGameObject = new SingleGameObject([mover], [view]);
    return newParticle;
}