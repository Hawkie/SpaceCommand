import { Coordinate, ICoordinate } from "ts/gamelib/Data/Coordinate";
import { IShape, Shape } from "ts/gamelib/Data/Shape";
import { Transforms } from "ts/gamelib/Physics/Transforms";
import { MoveConstVelocity, IMoveOut } from "ts/gamelib/Actors/Movers";
import { ISprite, HorizontalSpriteSheet } from "ts/gamelib/Data/Sprite";
import { IGraphic, Graphic } from "ts/gamelib/Data/Graphic";
import { IParticle } from "./AsteroidFields";
import { IVector, Vector } from "ts/gamelib/Data/Vector";
import { createShip, IShip } from "ts/States/Asteroids/Ship/ShipState";
import { IStateConfig } from "ts/gamelib/States/StateConfig";
import { IAsteroidModel } from "./IAsteroidModel";

export interface ISyncedArray<T> {
    items: T[];
    newItems: T[];
    oldItems: number[];
}

export interface IControls {
    left: boolean;
    right: boolean;
    up: boolean;
    fire: boolean;
}

export interface IParticleField {
    particles: IParticle[];
    particlesPerSecond: number;
    maxParticlesPerSecond: number;
    particleLifetime: number;
    particleSize: number;
    on: boolean;
    gravityStrength: number;
}

export interface IAsteroid {
    x: number;
    y: number;
    Vx: number;
    Vy :number;
    angle:number;
    spin:number;
    size:number;
    type:number;
    shape: IShape;
    graphic: string;
}

export interface IAsteroids {
    asteroids: IAsteroid[];
    playBreakSound: boolean;
    breakSoundFilename: string;
}

export interface IGraphicShip {
    x: number;
    y: number;
    Vx: number;
    Vy: number;
    angle: number;
    spin: number;
    mass: number;
    graphic: string;
}

export interface ICoin {
    x: number;
    y: number;
    Vx: number;
    Vy: number;
    angle: number;
    spin: number;
    mass: number;
    sprite: ISprite;
}

export interface IBall {
    x: number;
    y: number;
    Vx: number;
    Vy: number;
    r: number;
    mass: number;
}


export function createStateModel(): IAsteroidModel {
    var starField: IParticleField = createStarField();
    var ship: IShip = createShip(256, 240, 0);
    var ball: IBall = createBallObject(256, 280);
    var coin: ICoin = createCoin(new Coordinate(300, 400));
    var asteroids: IAsteroid[] = AsteroidModels.createAsteroidModels(3);
    var asteroidState: IAsteroids = {
        asteroids: asteroids,
        playBreakSound: false,
        breakSoundFilename: "res/sound/blast.wav",
    };
    var graphicShip: IGraphicShip = createGraphicShip(200, 100);
    var stateConfig: IStateConfig = {
        screenWrap: true,
        gravity: false,
    };

    // things that change
    var stateVariables: IAsteroidModel = {
        stateConfig: stateConfig,
        controls: {
            left: false,
            right: false,
            up: false,
            fire: false,
        },
        starField: starField,
        ship: ship,
        ball: ball,
        coin: coin,
        level: 3,
        asteroids: asteroidState,
        graphicShip: graphicShip,
        score: 0,
        title: "SpaceCommand",
    };
    return stateVariables;
}

export function createStarField(): IParticleField {
    return {
        particles: [],
        particlesPerSecond: 1,
        maxParticlesPerSecond: 1,
        particleLifetime: undefined,
        particleSize: 2,
        on: true,
        gravityStrength: 10,
    };
}

export function createGraphicShip(x: number, y:number): IGraphicShip {
    var gShip: IGraphicShip = {
        x: x,
        y: y,
        Vx: 0,
        Vy: 0,
        angle: 10,
        spin: 0,
        mass: 1,
        graphic: "res/img/ship.png",
    };
    return gShip;
}

export function createCoin(location: Coordinate): ICoin {
    var s: ISprite = new HorizontalSpriteSheet("res/img/spinningCoin.png", 46, 42, 10, 0, 0.5, 0.5);
    var coin: ICoin = {
        x: location.x,
        y: location.y,
        Vx: 0,
        Vy: 0,
        angle: 45,
        spin: 4,
        mass: 1,
        sprite: s,
    };
    return coin;
}

export function createBallObject(x: number, y: number): IBall {
    var ballModel: IBall = {
        x: x,
        y: y,
        Vx: 0,
        Vy: 0,
        mass: 1,
        r: 8,
    };
    return ballModel;
}

export class AsteroidModels {


    // 5 different asteroid shapes
    private static a1 = [-4, -2, -2, -4, 0, -2, 2, -4, 4, -2, 3, 0, 4, 2, 1, 4, -2, 4, -4, 2, -4, -2];
    private static a2 = [-3, 0, -4, -2, -2, -4, 0, -3, 2, -4, 4, -2, 2, -1, 4, 1, 2, 4, -1, 3, -2, 4, -4, 2, -3, 0];
    private static a3 = [-2, 0, -4, -1, -1, -4, 2, -4, 4, -1, 4, 1, 2, 4, 0, 4, 0, 1, -2, 4, -4, 1, -2, 0];
    private static a4 = [-1, -2, -2, -4, 1, -4, 4, -2, 4, -1, 1, 0, 4, 2, 2, 4, 1, 3, -2, 4, -4, 1, -4, -2, -1, -2];
    private static a5 = [-4, -2, -2, -4, 2, -4, 4, -2, 4, 2, 2, 4, -2, 4, -4, 2, -4, -2];
    static as = [AsteroidModels.a1, AsteroidModels.a2, AsteroidModels.a3, AsteroidModels.a4, AsteroidModels.a5];


    public static createAsteroidModels(level: number): IAsteroid[] {
        var asteroids: IAsteroid[] = [];
        for (var i: number = 0; i < level; i++) {
            var a: IAsteroid = AsteroidModels.createAsteroidModel(3);
            asteroids.push(a);
        }
        return asteroids;
    }

    public static createAsteroidModel(size: number): IAsteroid {
        let xy: number = Transforms.random(0, 3);
        let x: number = Transforms.random(0,512), y: number = Transforms.random(0, 480);
        if (xy === 0) {
            x = Transforms.random(0, 100);
        } else if (xy === 1) {
            x = Transforms.random(412, 512);
        } else if (xy === 2) {
            y = Transforms.random(0, 100);
        } else if (xy === 3) {
            y = Transforms.random(380, 480);
        }
        return AsteroidModels.createAsteroidModelAt(x,y, 0, 0, size);
    }

    public static createAsteroidModelAt(x: number, y: number, Vx: number, Vy:number, size: number): IAsteroid {
        var type:number = Transforms.random(0, 4);
        var points: number[] = AsteroidModels.as[type];
        var coords: ICoordinate[] = Transforms.ArrayToPoints(points);
        Transforms.scale(coords, size, size);
        var shape: IShape = new Shape(coords);
        var a: IAsteroid = {
            x: x,
            y: y,
            Vx: Vx + Transforms.random(-20, 20),
            Vy: Vy + Transforms.random(-20, 20),
            angle: Transforms.random(0, 359),
            spin:Transforms.random(-10, 10),
            size: size,
            type: type,
            shape: shape,
            graphic: "res/img/terrain.png",
        };
        return a;
    }
}