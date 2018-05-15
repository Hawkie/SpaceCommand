import { Coordinate, ICoordinate } from "ts/gamelib/Data/Coordinate";
import { IShape, Shape } from "ts/gamelib/Data/Shape";
import { Transforms } from "ts/gamelib/Physics/Transforms";
import { MoveConstVelocity, IMoveOut } from "ts/gamelib/Actors/Movers";
import { ISprite, HorizontalSpriteSheet } from "ts/gamelib/Data/Sprite";
import { IGraphic, Graphic } from "ts/gamelib/Data/Graphic";
import { IParticle } from "ts/States/Asteroids/AsteroidFields";
import { IVector, Vector } from "ts/gamelib/Data/Vector";
import { IParticleField } from "ts/States/Asteroids/AsteroidModels";

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

export function createShip(x: number, y: number): IShip {
    var triangleShip: ICoordinate[] = [new Coordinate(0, -4),
        new Coordinate(-2, 2),
        new Coordinate(0, 1),
        new Coordinate(2, 2),
        new Coordinate(0, -4)];
    Transforms.scale(triangleShip, 2, 2);

    // var breakable = new BreakableData(20, 20, 0, false, false);
    // var shape = new Shape(triangleShip);
    var ship: IShip = {
        x: x,
        y: y,
        Vx: 0,
        Vy: 0,
        thrust: new Vector(0, 0),
        angle: 0,
        spin: 0,
        mass: 1,
        shape: {points: triangleShip, offset: {x:0, y:0}},
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
                particles: [],
                particleSize: 1,
                particlesPerSecond: 20,
                maxParticlesPerSecond: 50,
                particleLifetime: 1,
                on: false,
                gravity: false,
            },
            soundFilename: "res/sound/thrust.wav"},
        explosion: {
            explosionParticleField: {
                particles: [],
                particleSize: 3,
                particlesPerSecond: 100,
                maxParticlesPerSecond: 50,
                particleLifetime: 5,
                on: false,
                gravity: false,
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
