import { Coordinate, ICoordinate } from "../../../gamelib/DataTypes/Coordinate";
import { IShape, Shape } from "../../../gamelib/DataTypes/Shape";
import { Transforms } from "../../../gamelib/Physics/Transforms";
import { DrawContext } from "../../../gamelib/1Common/DrawContext";
import { DrawPoly } from "../../../gamelib/Views/PolyViews";
import { IAsteroidsControls } from "../AsteroidsControlsComponent";
import { IWeapon, PullTrigger, DisplayWeapon, CreateWeapon, RemoveBullet } from "./WeaponComponent";
import { IExhaust, ExhaustCopyToUpdated, DisplayExhaust, CreateExhaust } from "./ThrustComponent";
import { IExplosion, DisplayExplosion, CreateExplosion, UpdateExplosion } from "./ExplosionComponent";
import { Game } from "../../../gamelib/1Common/Game";

export interface IPhysics {
    readonly x: number;
    readonly y: number;
    readonly Vx: number;
    readonly Vy: number;
    readonly forwardThrust: number;
    readonly angle: number;
    readonly spin: number;
}

export interface IAttached {
    readonly attached: boolean;
    readonly xTo: number;
    readonly yTo: number;
    readonly angularForce: number;
}

export interface IShip {
    readonly x: number;
    readonly y: number;
    readonly Vx: number;
    readonly Vy: number;
    readonly forwardThrust: number;
    readonly angle: number;
    readonly spin: number;
    readonly mass: number;
    readonly attached: boolean;
    readonly xTo: number;
    readonly yTo: number;
    readonly angularForce: number;
    readonly shape: IShape;
    readonly gravityStrength: number;
    readonly hitPoints: number;
    readonly damage: number;
    readonly armour: number;
    readonly disabled: boolean;
    readonly broken: boolean;
    readonly fuel: number;
    readonly energy: number;
    readonly colour: string;
    readonly maxForwardForce: number;
    readonly maxRotationalSpeed: number;
    readonly crashed: boolean;
    readonly trigger1: boolean;
    readonly weapon1: IWeapon;
    readonly exhaust: IExhaust;
    readonly explosion: IExplosion;
    move(ship: IShip, timeModifier: number): IShip;
}


export function CreateShip(x: number, y: number,
    gravityStrength: number,
    ball: boolean,
    move:(ship: IShip, timeModifier: number) => IShip): IShip {
    let triangleShip: ICoordinate[] = [new Coordinate(0, -8),
        new Coordinate(-4, 4),
        new Coordinate(0, 2),
        new Coordinate(4, 4),
        new Coordinate(0, -8)];
    // let scaledShip: ICoordinate[] = Transforms.Scale(triangleShip, 2, 2);

    let ship: IShip = {
        x: x,
        y: y,
        Vx: 0,
        Vy: 0,
        forwardThrust: 0,
        angle: 0,
        spin: 0,
        mass: 1,
        attached: ball,
        xTo: 256, // change how initialised
        yTo: 280, // change how initialised
        angularForce: 0,
        shape: {points: triangleShip, offset: {x:0, y:0}},
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
        trigger1: false,
        weapon1: CreateWeapon(0.5, 128),
        exhaust: CreateExhaust(),
        explosion: CreateExplosion(),
        move: move,
    };
    return ship;
}

export function DisplayShip(ctx: DrawContext, ship: IShip): void {
    DrawPoly(ctx, ship.x + ship.shape.offset.x, ship.y + ship.shape.offset.y, ship.shape);
    DisplayExhaust(ctx, ship.exhaust);
    DisplayExplosion(ctx, ship.explosion, ship.x + ship.shape.offset.x, ship.y + ship.shape.offset.y);
    DisplayWeapon(ctx, ship.weapon1);
}

// doesn't change state
export function ShipSounds(ship: IShip): void {
    if (ship.crashed) {
        Game.assets.explosion.playOnce();
    }
    if (ship.exhaust.thrustOn) {
        Game.assets.thrust.play();
    } else {
        Game.assets.thrust.pause();
    }
    if (ship.weapon1.fired) {
        Game.assets.gun.replay();
    }
}

export function ShipCopyToUpdated(timeModifier: number, ship: IShip, controls: IAsteroidsControls): IShip {
    let newShip: IShip = ShipApplyControls(ship, controls);
    newShip = newShip.move(newShip, timeModifier);
    newShip = ShipSubComponents(newShip, timeModifier);
    return newShip;
}

function ShipApplyControls(ship: IShip, controls: IAsteroidsControls): IShip {
    let newShip: IShip = ship;
    let spin: number = 0;
    let thrust: number = 0;
    let fireWeapon1: boolean = false;
    if (!ship.crashed) {
        if (controls.left) {
            spin = -newShip.maxRotationalSpeed;
        }
        if (controls.right) {
            spin = newShip.maxRotationalSpeed;
        }
        if (controls.up) {
            thrust = newShip.maxForwardForce;
        }
        if (controls.fire) {
            fireWeapon1 = true;
        }
    }
    return {...newShip,
        spin: spin,
        // update thrust angle
        forwardThrust: thrust,
        trigger1: fireWeapon1,
    };
}

function ShipSubComponents(ship: IShip, timeModifier: number): IShip {
    return {...ship,
        exhaust: ExhaustCopyToUpdated(timeModifier, ship.exhaust,
            ship.forwardThrust>0, ship.x, ship.y, ship.Vx, ship.Vy, ship.angle, ship.forwardThrust),
        weapon1: PullTrigger(timeModifier, ship.weapon1,
            ship.trigger1, ship.x, ship.y, ship.Vx, ship.Vy, ship.angle, ship.weapon1.bulletVelocity),
        explosion: UpdateExplosion(timeModifier, ship.explosion, ship.crashed, ship.x, ship.y, ship.Vx, ship.Vy),
    };
}

export function CrashShip(ship: IShip, Vx: number, Vy: number): IShip {
    return {...ship,
        crashed: true,
        Vx: Vx,
        Vy: Vy,
    };
}

export function ShipCopyToRemovedBullet(ship: IShip, bulletIndex: number,): IShip {
    return {...ship,
        weapon1: RemoveBullet(ship.weapon1, bulletIndex),
    };
}