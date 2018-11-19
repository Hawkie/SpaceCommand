import { IParticleField } from "../FieldComponent";
import { DrawContext } from "../../../gamelib/1Common/DrawContext";
import { Transforms } from "../../../gamelib/Physics/Transforms";
import { DisplayField, UpdateField } from "../../../gamelib/Components/ParticleFieldComponent";

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
            on: false,
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
    if (crashed) {
        let accumulatedTime: number = explosion.explosionTime + timeModifier;
        if (accumulatedTime < explosion.explosionDuration) {
            // inputs.ship.thrust.length = 0;
            return Object.assign({}, explosion, {
                explosionTime: accumulatedTime,
                explosionParticleField: UpdateField(timeModifier, explosion.explosionParticleField, true, 50,
                    (now: number) => {
                        return {
                            x: x + Transforms.random(-2, 2),
                            y: y + Transforms.random(-2, 2),
                            Vx: Vx + Transforms.random(-10, 10),
                            Vy: Vy + Transforms.random(-10, 10),
                            born: now,
                            size: 3,
                    };})
                });
            } else {
            return Object.assign({}, explosion, {
                explosionParticleField: UpdateFieldOn(timeModifier, explosion.explosionParticleField, false),
            });
        }
    }
    return explosion;
}

export function UpdateFieldOn(timeModifier: number, field: IParticleField, on: boolean): IParticleField {
    return Object.assign({}, field, {
        particles: [],
        on: on,
    });
}

