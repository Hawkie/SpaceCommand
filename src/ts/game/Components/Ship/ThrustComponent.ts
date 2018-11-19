import { IParticleField, UpdateField, DisplayField } from "../FieldComponent";
import { Transforms } from "../../../gamelib/Physics/Transforms";
import { ICoordinate } from "../../../gamelib/DataTypes/Coordinate";
import { DrawContext } from "../../../gamelib/1Common/DrawContext";

export interface IExhaust {
    exhaustParticleField: IParticleField;
    soundFilename: string;
}

export function CreateExhaust(): IExhaust {
    return {
        exhaustParticleField: {
            accumulatedModifier: 0,
            toAdd: 0,
            particles: [],
            particleSize: 1,
            particlesPerSecond: 20,
            maxParticlesPerSecond: 50,
            particleLifetime: 1,
            on: false, // state
            gravityStrength: 0,
        },
        soundFilename: "res/sound/thrust.wav"
    };
}

export function DisplayExhaust(ctx: DrawContext, exhaust: IExhaust): void {
    DisplayField(ctx, exhaust.exhaustParticleField.particles);
}

export function UpdateExhaust(timeModifier: number,
        exhaust: IExhaust,
        on: boolean,
        x: number, y: number, Vx: number, Vy: number,
        angle: number,
        length: number): IExhaust {
    let velocity: ICoordinate = Transforms.VectorToCartesian(angle + Transforms.random(-5, 5) + 180,
    length * 5 + Transforms.random(-5, 5));
    return Object.assign({}, exhaust, {
        exhaustParticleField: UpdateField(timeModifier, exhaust.exhaustParticleField, on, 20, (now: number) => {
                return {
                    x: x + Transforms.random(-2, 2),
                    y: y + Transforms.random(-2, 2),
                    Vx: Vx + velocity.x,
                    Vy: Vy + velocity.y,
                    born: now,
                    size: 1,
            };
        })
    });
}