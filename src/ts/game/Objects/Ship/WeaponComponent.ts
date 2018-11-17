import { IParticle, DisplayField } from "../../Components/FieldComponent";
import { MoveWithVelocity } from "../../../gamelib/Actors/Movers";
import { Coordinate } from "../../../gamelib/DataTypes/Coordinate";
import { Transforms } from "../../../gamelib/Physics/Transforms";
import { DrawContext } from "../../../gamelib/1Common/DrawContext";

export interface IWeapon {
    bullets: IParticle[];
    lastFired: number;
    fired: boolean;
    bulletVelocity: number;
    bulletLifetime: number;
    bulletsPerSecond: number;
}

export function CreateWeapon(bulletsPerSecond: number, bulletVelocity: number): IWeapon {
    return {
        bullets: [],
        lastFired: undefined,
        fired: false,
        bulletLifetime: 5,
        bulletVelocity: bulletVelocity,
        bulletsPerSecond: bulletsPerSecond,
    };
}

export function DisplayWeapon(ctx: DrawContext, weapon: IWeapon): void {
    DisplayField(ctx, weapon.bullets);
}

export function UpdateWeapon(timeModifier: number, weapon: IWeapon,
    reloaded: boolean,
    x: number, y: number, angle: number, bulletVelocity: number): IWeapon {
let w: IWeapon = weapon;
let fired: boolean = false;
if (reloaded) {
    fired = true;
    let velocity: Coordinate = Transforms.VectorToCartesian(angle, bulletVelocity);
    let now: number = Date.now();
    let bullet: IParticle = {
        x: x,
        y: y,
        Vx: velocity.x,
        Vy: velocity.y,
        born: now,
        size: 2,
    };
    // add bullets
    w = Object.assign({}, weapon, {
        bullets: weapon.bullets.concat(bullet),
        lastFired: now,
        fired: fired,
    });
}
// move bullets and set fired
return Object.assign({}, w, {
    bullets: w.bullets.map((b)=> MoveWithVelocity(timeModifier, b, b.Vx, b.Vy)),
    fired: fired
});
}