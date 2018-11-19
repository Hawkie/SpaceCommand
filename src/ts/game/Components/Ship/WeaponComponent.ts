import { MoveWithVelocity } from "../../../gamelib/Actors/Movers";
import { Coordinate } from "../../../gamelib/DataTypes/Coordinate";
import { Transforms } from "../../../gamelib/Physics/Transforms";
import { DrawContext } from "../../../gamelib/1Common/DrawContext";
import { IParticle, DisplayField } from "../../../gamelib/Components/ParticleFieldComponent";
import { FilterParticles } from "../../../gamelib/Actors/FieldParticleRemover";

export interface IWeapon {
    readonly bullets: IParticle[];
    readonly lastFired: number;
    readonly fired: boolean;
    readonly bulletVelocity: number;
    readonly bulletLifetime: number;
    readonly bulletsPerSecond: number;
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

    const now:number = Date.now();
    let bullets: IParticle[] = FilterParticles(w.bullets, now, w.bulletLifetime);
    bullets = bullets.map((b)=> MoveWithVelocity(timeModifier, b, b.Vx, b.Vy));

    // move bullets and set fired
    return Object.assign({}, w, {
        bullets: bullets,
        fired: fired
    });
}