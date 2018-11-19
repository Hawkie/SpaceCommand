import { IParticleField, FieldGenRemMove } from "../FieldComponent";
import { DrawContext } from "../../../gamelib/1Common/DrawContext";
import { Transforms } from "../../../gamelib/Physics/Transforms";
import { DisplayField, FieldGenMove } from "../../../gamelib/Components/ParticleFieldComponent";

export interface IExplosion {
    readonly explosionParticleField: IParticleField;
    readonly explosionDuration: number;
    readonly explosionTime: number;
    readonly soundFilename: string;
    readonly flash: {
        readonly flashScreenValue: number;
        readonly flashRepeat: number;
    };
}

export function CreateExplosion(): IExplosion {
    return {
        explosionParticleField: {
            accumulatedModifier: 0,
            toAdd: 0,
            particles: [],
            particleSize: 3,
            particlesPerSecond: 100,
            maxParticlesPerSecond: 50,
            particleLifetime: 5,
            gravityStrength: 0,
        },
        explosionDuration: 5,
        explosionTime: 0,
        soundFilename: "res/sound/explosion.wav",
        flash: {
            flashScreenValue: 0,
            flashRepeat: 10,
        },
    };
}

export function DisplayExplosion(ctx: DrawContext, explosion: IExplosion): void {
    DisplayField(ctx, explosion.explosionParticleField.particles);
}

export function UpdateExplosion(timeModifier: number, explosion: IExplosion,
        crashed: boolean,
        x: number, y: number, Vx: number, Vy: number): IExplosion {
    let on: boolean = false;
    let accumulatedTime: number = 0;
    let e: IExplosion = explosion;
    if (crashed) {
        accumulatedTime = explosion.explosionTime + timeModifier;
        if (accumulatedTime < explosion.explosionDuration) {
            on = true;
        }
    }
    return Object.assign({}, e, {
        explosionTime: accumulatedTime,
        explosionParticleField: FieldGenRemMove(timeModifier,
            e.explosionParticleField, on, 50, 5,
            (now: number) => {
                return {
                    x: x + Transforms.random(-2, 2),
                    y: y + Transforms.random(-2, 2),
                    Vx: Vx + Transforms.random(-10, 10),
                    Vy: Vy + Transforms.random(-10, 10),
                    born: now,
                    size: 3,
            };
        })
    });
}


