import { IView } from "../../../gamelib/Views/View";
import { RectangleView } from "../../../gamelib/Views/RectangleView";
import { MoveConstVelocity, IMoveOut } from "../../../gamelib/Actors/Movers";
import { SingleGameObject } from "../../../gamelib/GameObjects/SingleGameObject";
import { IActor } from "../../../gamelib/Actors/Actor";

// import { Sound } from "../../../gamelib/Actors/Sound";
import { CircleView } from "../../../gamelib/Views/CircleView";
import { IParticle } from "../../Components/FieldComponent";

export function createBulletObject(getParticle: () => IParticle): SingleGameObject {
    let particle: IParticle = getParticle();
    let mover: IActor = new MoveConstVelocity(() => particle, (out: IMoveOut) => {
        particle.x += out.dx;
        particle.y += out.dy;
    });
    let view: IView = new CircleView(() => {
        return {
            x: particle.x,
            y: particle.y,
            r: particle.size,
        };
    });
    let particleObj: SingleGameObject = new SingleGameObject([mover], [view]);
    // let fireSound: IActor = new Sound("res/sound/raygun-01.mp3", true, false, () => {
    //     return {
    //         play: true,
    //     };
    // });
    // particleObj.actors.push(fireSound);
    return particleObj;
}