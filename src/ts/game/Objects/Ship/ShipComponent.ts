import { Coordinate, ICoordinate } from "../../../gamelib/DataTypes/Coordinate";
import { IShape, Shape } from "../../../gamelib/DataTypes/Shape";
import { Transforms } from "../../../gamelib/Physics/Transforms";
import { IVector, Vector } from "../../../gamelib/DataTypes/Vector";
import { IParticleField, IParticle, DisplayField, UpdateField } from "../../Components/FieldComponent";
import { DrawContext } from "../../../gamelib/1Common/DrawContext";
import { DrawPoly } from "../../../gamelib/Views/PolyViews";
import { IAsteroidsControls } from "../../States/Asteroids/AsteroidsControlsComponent";
import { MoveWithVelocity } from "../../../gamelib/Actors/Movers";
import { RotateShape } from "../../../gamelib/Actors/Rotators";
import { AccelerateWithVelocity } from "../../../gamelib/Actors/Accelerator";
import { IWeapon, UpdateWeapon, DisplayWeapon, CreateWeapon } from "./WeaponComponent";


export interface IShip {
    x: number;
    y: number;
    Vx: number;
    Vy: number;
    thrust: IVector;
    angle: number;
    spin: number;
    mass: number;
    shape: IShape;
    gravityStrength: number;
    hitPoints: number;
    damage: number;
    armour: number;
    disabled: boolean;
    broken: boolean;
    fuel: number;
    energy: number;
    colour: string;
    maxForwardForce: number;
    maxRotationalSpeed: number;
    crashed: boolean;
    weapon1: IWeapon;
    exhaust: IExhaust;
    explosion: IExplosion;
}

export interface IExhaust {
    exhaustParticleField: IParticleField;
    soundFilename: string;
}

export interface IExplosion {
    explosionParticleField: IParticleField;
    explosionLifetime: number;
    exploded: boolean;
    soundFilename: string;
    flash: {
        flashScreenValue: number;
        flashRepeat: number;
    };
}

export function createShip(x: number, y: number, gravityStrength: number): IShip {
    let triangleShip: ICoordinate[] = [new Coordinate(0, -4),
        new Coordinate(-2, 2),
        new Coordinate(0, 1),
        new Coordinate(2, 2),
        new Coordinate(0, -4)];
    let scaledShip: ICoordinate[] = Transforms.Scale(triangleShip, 2, 2);

    // let breakable = new BreakableData(20, 20, 0, false, false);
    // let shape = new Shape(triangleShip);
    let ship: IShip = {
        x: x,
        y: y,
        Vx: 0,
        Vy: 0,
        thrust: new Vector(0, 0),
        angle: 0,
        spin: 0,
        mass: 1,
        shape: {points: scaledShip, offset: {x:0, y:0}},
        gravityStrength: gravityStrength,
        hitPoints: 100,
        damage: 0,
        armour: 0,
        disabled: false,
        broken: false,
        fuel: 1000,
        energy: 1000,
        colour: "#fff",
        maxForwardForce: 16,
        maxRotationalSpeed: 64,
        crashed: false,
        weapon1: CreateWeapon(2, 128),
        exhaust: {
            exhaustParticleField: {
                accumulatedModifier: 0,
                toAdd: 0,
                particles: [],
                particleSize: 1,
                particlesPerSecond: 20,
                maxParticlesPerSecond: 50,
                particleLifetime: 1,
                on: false,
                gravityStrength: gravityStrength,
            },
            soundFilename: "res/sound/thrust.wav"},
        explosion: {
            explosionParticleField: {
                accumulatedModifier: 0,
                toAdd: 0,
                particles: [],
                particleSize: 3,
                particlesPerSecond: 100,
                maxParticlesPerSecond: 50,
                particleLifetime: 5,
                on: false,
                gravityStrength: gravityStrength,
            },
            explosionLifetime: 1,
            exploded: false,
            soundFilename: "res/sound/explosion.wav",
            flash: {
                flashScreenValue: 0,
                flashRepeat: 10,
            },
        },
    };
    return ship;
}

export function DisplayShip(ctx: DrawContext, ship: IShip): void {
    DrawPoly(ctx, ship.x + ship.shape.offset.x, ship.y + ship.shape.offset.y, ship.shape);
    DisplayField(ctx, ship.exhaust.exhaustParticleField.particles);
    DisplayField(ctx, ship.explosion.explosionParticleField.particles);
    DisplayWeapon(ctx, ship.weapon1);
}

export function UpdateShip(timeModifier: number, ship: IShip, controls: IAsteroidsControls): IShip {
    let spin: number = 0;
    let thrust: number = ship.thrust.length;
    let reloaded: boolean = false;
    if (!ship.crashed) {
        if (controls.left) {
            spin = -ship.maxRotationalSpeed;
            // keep thrust vector in line with ship angle
        } else if (controls.right) {
            spin = ship.maxRotationalSpeed;
            // keep thrust vector in line with ship angle
        }
        if (controls.up) {
            thrust = ship.maxForwardForce;
        } else {
            thrust = 0;
        }
        if (controls.fire) {
            if (ship.weapon1.lastFired === undefined
                || ((Date.now() - ship.weapon1.lastFired) / 1000) > (1/ship.weapon1.bulletsPerSecond)) {
                reloaded = true;
            }
        }
    }
    let newAngle: number = ship.angle + spin * timeModifier;
    let controlledShip: IShip = Object.assign({}, ship, {
        angle: newAngle,
        thrust: { angle: newAngle, length: thrust },
        exhaust: UpdateExhaust(timeModifier, ship.exhaust, thrust>0, ship.x, ship.y, ship.Vx, ship.Vy, newAngle, thrust),
        weapon1: UpdateWeapon(timeModifier, ship.weapon1, reloaded, ship.x, ship.y, ship.angle, ship.weapon1.bulletVelocity),
    });
    let thrustShip: IShip = AccelerateWithVelocity(timeModifier, controlledShip, [controlledShip.thrust], 10);
    let movedShip: IShip = MoveWithVelocity(timeModifier, thrustShip, thrustShip.Vx, thrustShip.Vy);
    let rotatedShip: IShip = RotateShape(timeModifier, movedShip, spin);
    return rotatedShip;
}


export function UpdateExhaust(timeModifier: number,
        exhaust: IExhaust,
        on: boolean,
        x: number, y: number, Vx: number, Vy: number,
        angle: number,
        length: number): IExhaust {
    let velocity: Coordinate = Transforms.VectorToCartesian(angle + Transforms.random(-5, 5) + 180,
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