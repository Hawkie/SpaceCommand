import { IView } from "../../../gamelib/Views/View";
import { IActor } from "../../../gamelib/Actors/Actor";
import { MoveConstVelocity, IMoveOut } from "../../../gamelib/Actors/Movers";
import { RectangleView } from "../../../gamelib/Views/RectangleView";
import { SingleGameObject } from "../../../gamelib/GameObjects/SingleGameObject";
import { IParticle } from "./IParticle";

// creates a constantly moving particle with rectangle shape
export function createParticleObject(p: IParticle): SingleGameObject {
    let mover: IActor = new MoveConstVelocity(() => {
        return {
            Vx: p.Vx,
            Vy: p.Vy,
        };
    }, (out: IMoveOut) => {
        p.x += out.dx;
        p.y += out.dy;
    });
    let view: IView = new RectangleView(() => {
        return {
            x: p.x,
            y: p.y,
            width: p.size,
            height: p.size,
        };
    });
    let newParticle: SingleGameObject = new SingleGameObject([mover], [view]);
    return newParticle;
}