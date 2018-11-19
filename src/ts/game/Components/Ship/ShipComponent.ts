import { Coordinate, ICoordinate } from "../../../gamelib/DataTypes/Coordinate";
import { IShape, Shape } from "../../../gamelib/DataTypes/Shape";
import { Transforms } from "../../../gamelib/Physics/Transforms";
import { IVector, Vector } from "../../../gamelib/DataTypes/Vector";
import { IParticleField, IParticle, DisplayField, UpdateField } from "../FieldComponent";
import { DrawContext } from "../../../gamelib/1Common/DrawContext";
import { DrawPoly } from "../../../gamelib/Views/PolyViews";
import { IAsteroidsControls } from "../../States/Asteroids/Components/AsteroidsControlsComponent";
import { MoveWithVelocity } from "../../../gamelib/Actors/Movers";
import { RotateShape } from "../../../gamelib/Actors/Rotators";
import { AccelerateWithForces } from "../../../gamelib/Actors/Accelerator";
import { IWeapon, UpdateWeapon, DisplayWeapon, CreateWeapon } from "./WeaponComponent";
import { UpdateConnection } from "../../../gamelib/Actors/CompositeAccelerator";
import { Wrap } from "../../../gamelib/Actors/Wrap";
import { IExhaust, UpdateExhaust, DisplayExhaust, CreateExhaust } from "./ThrustComponent";
import { IExplosion, DisplayExplosion, CreateExplosion, UpdateExplosion } from "./ExplosionComponent";


export interface IShip {
    x: number;
    y: number;
    Vx: number;
    Vy: number;
    thrust: IVector;
    angle: number;
    spin: number;
    mass: number;
    xTo: number;
    yTo: number;
    angularForce: number;
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


export function CreateShip(x: number, y: number, gravityStrength: number): IShip {
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
        xTo: 256, // change how initialised
        yTo: 280, // change how initialised
        angularForce: 0,
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
        exhaust: CreateExhaust(),
        explosion: CreateExplosion(),
    };
    return ship;
}

export function DisplayShip(ctx: DrawContext, ship: IShip): void {
    DrawPoly(ctx, ship.x + ship.shape.offset.x, ship.y + ship.shape.offset.y, ship.shape);
    DisplayExhaust(ctx, ship.exhaust);
    DisplayExplosion(ctx, ship.explosion);
    DisplayWeapon(ctx, ship.weapon1);
}

export function UpdateShip(timeModifier: number, ship: IShip, controls: IAsteroidsControls): IShip {
    let spin: number = 0;
    let thrust: number = ship.thrust.length;
    let reloaded: boolean = false;
    if (!ship.crashed) {
        if (controls.left) {
            spin = -ship.maxRotationalSpeed;
        } else if (controls.right) {
            spin = ship.maxRotationalSpeed;
        }
        if (controls.up) {
            thrust = ship.maxForwardForce;
        } else {
            thrust = 0;
        }
        if (controls.fire) {
            if (ship.weapon1.lastFired === undefined
                // todo move this to weapon
                || ((Date.now() - ship.weapon1.lastFired) / 1000) > (1/ship.weapon1.bulletsPerSecond)) {
                reloaded = true;
            }
        }
    }
    let newAngle: number = ship.angle + spin * timeModifier;
    let controlledShip: IShip = Object.assign({}, ship, {
        angle: newAngle,
        // update thrust angle
        thrust: { angle: newAngle, length: thrust },
        exhaust: UpdateExhaust(timeModifier, ship.exhaust, thrust>0, ship.x, ship.y, ship.Vx, ship.Vy, newAngle, thrust),
        weapon1: UpdateWeapon(timeModifier, ship.weapon1, reloaded, ship.x, ship.y, ship.angle, ship.weapon1.bulletVelocity),
        explosion: UpdateExplosion(timeModifier, ship.explosion, ship.crashed, ship.x, ship.y, ship.Vx, ship.Vy),
    });
    // let thrustShip: IShip = AccelerateWithVelocity(timeModifier, controlledShip, [controlledShip.thrust], 10);
    let ballShip: IShip = UpdateConnection(timeModifier, controlledShip, ship.mass, [controlledShip.thrust], 2);
    let movedShip: IShip = MoveWithVelocity(timeModifier, ballShip, ballShip.Vx, ballShip.Vy);
    let rotatedShip: IShip = RotateShape(timeModifier, movedShip, spin);
    let wrappedShip: IShip = Object.assign({}, rotatedShip, {
        x: Wrap(rotatedShip.x, 0, 512),
        y: Wrap(rotatedShip.y, 0, 480)
    });
    return wrappedShip;
}


