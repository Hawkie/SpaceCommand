import { Coordinate, ICoordinate } from "../../../gamelib/DataTypes/Coordinate";
import { IShape, Shape } from "../../../gamelib/DataTypes/Shape";
import { Transforms } from "../../../gamelib/Physics/Transforms";
import { IParticle } from "../../../game/Objects/Particle/IParticle";
import { IVector, Vector } from "../../../gamelib/DataTypes/Vector";
import { IParticleField } from "../../States/Asteroids/createAsteroidData";

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

export interface IWeapon {
    bullets: IParticle[];
    lastFired: number;
    bulletVelocity: number;
    bulletLifetime: number;
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
        weapon1: {
            bullets: [],
            lastFired: undefined,
            bulletLifetime: 5,
            bulletVelocity: 128,
        },
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
