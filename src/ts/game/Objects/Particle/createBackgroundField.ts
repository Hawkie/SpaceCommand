import { IParticleField } from "../../States/Asteroids/createAsteroidData";
import { MultiGameObject } from "ts/gamelib/GameObjects/MultiGameObject";
import { SingleGameObject } from "ts/gamelib/GameObjects/SingleGameObject";
import { createParticleField } from "./createParticleField";
// todo add the edge predicate to background
//     let edge1:PredGreaterThan<IParticle> = new PredGreaterThan(()=>700, (p: IParticle)=> p.y);
export function createBackgroundField(getField: () => IParticleField, speed: number): MultiGameObject<SingleGameObject> {
    let field: IParticleField = getField();
    let starField: MultiGameObject<SingleGameObject> = createParticleField(field, () => {
        return {
            on: field.on,
            x: 0,
            xOffset: 0,
            xLowSpread: 0,
            xHighSpread: 512,
            y: 0,
            yOffset: 0,
            yLowSpread: 0,
            yHighSpread: 0,
            Vx: 0,
            vXLowSpread: 0,
            vXHighSpread: 0,
            Vy: speed,
            vYLowSpread: 0,
            vYHighSpread: 10,
        };
    });
    return starField;
}