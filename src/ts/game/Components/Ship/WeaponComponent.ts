import { MoveWithVelocity } from "../../../gamelib/Actors/Movers";
import { Coordinate } from "../../../gamelib/DataTypes/Coordinate";
import { Transforms } from "../../../gamelib/Physics/Transforms";
import { DrawContext } from "../../../gamelib/1Common/DrawContext";
import { IParticle, DisplayField } from "../../../gamelib/Components/ParticleFieldComponent";
import { FilterParticles } from "../../../gamelib/Actors/FieldParticleRemover";

export interface IWeapon {
    readonly bullets: ReadonlyArray<IParticle>;
    readonly lastFired: number;
    readonly fired: boolean;
    readonly bulletVelocity: number;
    readonly bulletLifetime: number;
    readonly reloadTimeSec: number;
}

export function CreateWeapon(reloadTimeSec: number, bulletVelocity: number): IWeapon {
    return {
        bullets: [],
        lastFired: undefined,
        fired: false,
        bulletLifetime: 5,
        bulletVelocity: bulletVelocity,
        reloadTimeSec: reloadTimeSec,
    };
}

export function DisplayWeapon(ctx: DrawContext, weapon: IWeapon): void {
    DisplayField(ctx, weapon.bullets);
}

export function RemoveBullet(weapon: IWeapon, bulletIndex: number): IWeapon {
    let b: IParticle[] = weapon.bullets.map(b => b);
    b.splice(bulletIndex, 1);
    return {...weapon,
        bullets: b
    };
}

export function PullTrigger(timeModifier: number, weapon: IWeapon,
        fireWeaponIntent: boolean,
        x: number, y: number, Vx: number, Vy:number, angle: number, bulletVelocity: number): IWeapon {
    // local varibales
    let reloaded: boolean = false;
    let fired: boolean = false;
    // read object properties
    let bullets: IParticle[] = weapon.bullets.map(b => b);
    let lastFired: number = weapon.lastFired;
    const now:number = Date.now();
    if (fireWeaponIntent) {
        if (lastFired === undefined
            // todo move this to weapon
            || ((now - lastFired) / 1000) > weapon.reloadTimeSec) {
            reloaded = true;
            lastFired = now;
        }
    }
    if (reloaded) {
        fired = true;
        let velocity: Coordinate = Transforms.VectorToCartesian(angle, bulletVelocity);
        let bullet: IParticle = {
            x: x,
            y: y,
            Vx: Vx + velocity.x,
            Vy: Vy + velocity.y,
            born: now,
            size: 2,
        };
        // add bullets
        bullets.push(bullet);
    }

    // remove old bullets
    bullets = FilterParticles(bullets, now, weapon.bulletLifetime);
    bullets = bullets.map((b)=> MoveWithVelocity(timeModifier, b, b.Vx, b.Vy));

    // move bullets and set fired
    return {...weapon,
        bullets: bullets,
        fired: fired,
        lastFired: lastFired,
    };
}