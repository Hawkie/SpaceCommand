// import { Coordinate, Vector, ICoordinate } from "ts/Physics/Common";
// import { ILocated, ILocatedAngledMoving, ILocatedAngledMovingRotatingForces } from "ts/Data/PhysicsData";
// import { MoveConstVelocity, IMoveOut } from "ts/Actors/Movers";
// import { IActor } from "ts/Actors/Actor";
// import { ShapeData } from "ts/Data/ShapeData";
// import { AgePred, ParticleRemover } from "ts/Actors/ParticleFieldUpdater";
// import { IGameObject, SingleGameObject, ComponentObjects, MultiGameObject } from "ts/GameObjects/GameObject";
// import { Field, IParticle } from "ts/GameObjects/ParticleField";
// import { AudioObject } from "ts/Sound/SoundObject";
// import { RectangleView } from "ts/Views/PolyViews";
// import { FXObject } from "ts/Sound/FXObject";
// import { SoundEffectData } from "ts/States/SoundDesigner/SoundEffectsModel";
// import { ShapedModel } from "ts/Models/DynamicModels";
// import { ShipComponents } from "ts/Controllers/Ship/ShipComponents";
// import { IView } from "../../Views/View";
// import { Transforms } from "../../Physics/Transforms";

// export interface IWeaponInputs {
//     x: number;
//     y: number;
//     angle: number;
//     offsetAngle: number;
//     bulletVelocity: number;
// }

// export interface IWeaponController extends IGameObject {
//     // data
//     bulletField: MultiGameObject<any, SingleGameObject<IParticle>>;
//     // gun: SingleGameObject<ShapedModel<ILocatedAngledMoving, ShapeData>>;

//     // control
//     pullTrigger(): void;
//     bullets: ICoordinate[];
// }

// export class WeaponController extends ComponentObjects<IGameObject> implements IWeaponController {
//     laserEffect = new SoundEffectData(
//     1046.5,           // frequency
//     0,                // attack
//     0.3,              // decay
//     "sawtooth",       // waveform
//     1,                // volume
//     -0.8,             // pan
//     0,                // wait before playing
//     1200,             // pitch bend amount
//     false,            // reverse bend
//     25,               // dissonance
//     [0.1, 0.2, 2000], // echo: [delay, feedback, filter]
//     undefined,        // reverb: [duration, decay, reverse?]
//     3);               // maximum duration of sound, in seconds

//     laserSound: FXObject;
//     soundPlayed: boolean = false;
//     last: number;

//     constructor(private getInputs:() => IWeaponInputs, public bulletField: MultiGameObject<null, SingleGameObject<IParticle>>,
//         // public gun: SingleGameObject<ShapedModel<ILocatedAngledMoving, ShapeData>>,
//         actx: AudioContext) {
//         super([bulletField]);
//         this.laserSound = new FXObject(actx, this.laserEffect);
//         this.last = Date.now();
//     }

//     // creating new array of bullets. Need to splice original when hit things
//     get bullets(): ICoordinate[] {
//             return this.bulletField.components.map((value)=> {
//                 return {
//                     x: value.model.x,
//                     y: value.model.y };
//                 });
//     }

//     pullTrigger(): void {
//         // put firerate check in here
//         var inputs: IWeaponInputs = this.getInputs();
//         let now: number = Date.now();
//         let elapsedTimeSec: number = (now - this.last)/1000;
//         if (elapsedTimeSec >= 1/2) {
//             this.last = now;
//             var cartesian: Coordinate = Transforms.VectorToCartesian(inputs.angle + inputs.offsetAngle, inputs.bulletVelocity);
//             var particle: IParticle = {
//                 x: inputs.x,
//                 y: inputs.y,
//                 Vx: cartesian.x,
//                 Vy: cartesian.y,
//                 born: now,
//                 size: 2,
//             };
//             var mover: IActor = new MoveConstVelocity(
//                 () => particle,
//                 (out: IMoveOut) => {
//                     particle.x += out.dx;
//                     particle.y += out.dy;
//                 }
//             );
//             var view:IView = new RectangleView(()=> { return {
//                 x: particle.x,
//                 y: particle.y,
//                 width: particle.size,
//                 height: particle.size,
//             };});
//             let pObj: SingleGameObject<IParticle> = new SingleGameObject<IParticle>(particle, [mover], [view]);
//             this.bulletField.components.push(pObj);
//             this.laserSound.play();
//         }
//     }

//     static createWeapon(getInputs: ()=> IWeaponInputs, actx: AudioContext): IWeaponController {
//         let pField: SingleGameObject<IParticle>[] = [];
//         var field: MultiGameObject<any, SingleGameObject<IParticle>> = new MultiGameObject(null, [], [], pField);
//         var age5: AgePred<SingleGameObject<IParticle>> = new AgePred(()=>5, (p: SingleGameObject<IParticle>)=> p.model.born);
//         var remover: ParticleRemover<SingleGameObject<IParticle>> = new ParticleRemover<SingleGameObject<IParticle>>(
//             () => {
//                 ParticleRemover.remove(
//                     () => field.components,
//                     [age5]);});
//         // add the generator to the field object
//         field.actors.push(remover);
//         // var gun: SingleGameObject<ShapedModel<ILocatedAngledMoving, ShapeData>> = ShipComponents.createGun(data);
//         return new WeaponController(getInputs, field, actx);
//     }
// }