// import { MultiGameObject } from "../../../gamelib/GameObjects/MultiGameObject";
// import { SingleGameObject } from "../../../gamelib/GameObjects/SingleGameObject";
// import { createParticleField } from "./createParticleField";
// import { IParticleField } from "../../Components/FieldComponent";
// // todo add the edge predicate to background
// //     let edge1:PredGreaterThan<IParticle> = new PredGreaterThan(()=>700, (p: IParticle)=> p.y);
// export function createBackgroundField(getField: () => IParticleField, speed: number): MultiGameObject<SingleGameObject> {
//     let field: IParticleField = getField();
//     let starField: MultiGameObject<SingleGameObject> = createParticleField(field, () => {
//         return {
//             on: field.on,
//             x: 0,
//             xOffset: 0,
//             xLowSpread: 0,
//             xHighSpread: 512,
//             y: 0,
//             yOffset: 0,
//             yLowSpread: 0,
//             yHighSpread: 0,
// tslint:disable-next-line:comment-format
//             Vx: 0,
//             vXLowSpread: 0,
//             vXHighSpread: 0,
// tslint:disable-next-line:comment-format
//             Vy: speed,
//             vYLowSpread: 0,
//             vYHighSpread: 10,
//         };
//     });
//     return starField;
// }