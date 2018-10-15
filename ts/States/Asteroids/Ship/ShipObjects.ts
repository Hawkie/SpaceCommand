import { AsteroidModels, IParticleField, IControls } from "ts/States/Asteroids/AsteroidModels";
import { IAsteroidModel } from "../IAsteroidModel";
import { IView } from "ts/gamelib/Views/View";
import { PolyView, LineView } from "ts/gamelib/Views/PolyViews";
import { PolyGraphicAngled } from "ts/gamelib/Views/PolyGraphicAngled";
import { RectangleView } from "ts/gamelib/Views/RectangleView";
import { CircleView } from "ts/gamelib/Views/CircleView";
import { MoveConstVelocity, IMoveOut } from "ts/gamelib/Actors/Movers";
import { SingleGameObject, IGameObject, MultiGameObject } from "ts/gamelib/GameObjects/GameObject";
import { IActor } from "ts/gamelib/Actors/Actor";
import { PolyRotator } from "ts/gamelib/Actors/Rotators";
import { IShape } from "ts/gamelib/Data/Shape";
import { createExplosionController, createShipController } from "ts/States/Asteroids/Ship/ShipActors";
import { createWeaponController } from "ts/States/Asteroids/Ship/createWeaponController";
import { CompositeAccelerator, IRodOutputs, IRodInputs } from "ts/gamelib/Actors/Accelerators";
import { Coordinate } from "ts/gamelib/Data/Coordinate";
import { IParticle, AsteroidFields, createParticleField } from "ts/States/Asteroids/AsteroidFields";
import { AgePred, ParticleRemover, IParticleGenInputs } from "ts/gamelib/Actors/ParticleFieldUpdater";
import { DrawContext } from "ts/gamelib/Common/DrawContext";
import { ISoundInputs, Sound } from "ts/gamelib/Actors/Sound";
import { ScreenFlashView } from "ts/gamelib/Views/EffectViews";
import { Flasher } from "ts/gamelib/Actors/Switches";
import { createWrapActor } from "ts/gamelib/Actors/Wrap";
import { Timer } from "ts/gamelib/Actors/Timers";
import { Transforms } from "ts/gamelib/Physics/Transforms";
import { IShip, IWeapon } from "ts/States/Asteroids/Ship/ShipState";
import { addGravity } from "../../Shared/Gravity";
import Accelerator, { IAcceleratorOutputs, IAcceleratorInputs } from "../../../gamelib/Actors/Accelerator";
import { IStateConfig } from "ts/gamelib/States/StateConfig";
import { Vector } from "../../../gamelib/Data/Vector";

export function createShipObject(getStateConfig: () => IStateConfig, getControls: () => IControls, getShip: () => IShip): SingleGameObject {
    var stateConfig: IStateConfig = getStateConfig();
    var ship: IShip = getShip();
    var controls: IControls = getControls();
    var mover: IActor = new MoveConstVelocity(() => {
        return {
            Vx: ship.Vx,
            Vy: ship.Vy,
        };
    }, (out: IMoveOut) => {
        ship.x += out.dx;
        ship.y += out.dy;
    });
    // adding ship thrust force
    var rotator: IActor = new PolyRotator(() => {
        return {
            angle: ship.angle,
            shape: ship.shape,
        };
    }, (out: IShape) => {
        ship.shape = out;
    });

    var shipView: IView = new PolyView(() => {
        return {
            x: ship.x,
            y: ship.y,
            shape: ship.shape,
        };
    });

    var shipObj: SingleGameObject = new SingleGameObject([mover, rotator], [shipView]);
    var shipController: IActor = createShipController(() => {
        return {
            left: controls.left,
            right: controls.right,
            up: controls.up,
            ship: ship,
        };
    });
    var explosionController: IActor = createExplosionController(() => {
        return {
            ship: ship,
        };
    });
    shipObj.actors.push(shipController, explosionController);
    if (stateConfig.screenWrap) {
        var wrapx: IActor = createWrapActor(() => {
            return {
                value: ship.x,
                lowLimit: 0,
                upLimit: 512,
            };
        }, (a) => ship.x = a);
        var wrapy: IActor = createWrapActor(() => {
            return {
                value: ship.y,
                lowLimit: 0,
                upLimit: 480,
            };
        }, (a) => ship.y = a);
        shipObj.actors.push(wrapx, wrapy);
    }

    // add Gravity
    if (ship.gravityStrength !== 0) {
        var getAcceleratorProps: () => IAcceleratorInputs = () => {
            return {
                x: ship.x,
                y: ship.y,
                Vx: ship.Vx,
                Vy: ship.Vy,
                forces: [new Vector(180, ship.gravityStrength)],
                mass: ship.mass
            };
        };
        var gravity: Accelerator = new Accelerator(getAcceleratorProps, (out: IAcceleratorOutputs) => {
            ship.Vx += out.dVx;
            ship.Vy += out.dVy;
        });
        shipObj.actors.push(gravity);
    }
    return shipObj;
}

export function createShipAccelerator(getShip: () => IShip): SingleGameObject {
    var ship: IShip = getShip();

    var thrust: Accelerator = new Accelerator(() => {
        return {
            x: ship.x,
            y: ship.y,
            Vx: ship.Vx,
            Vy: ship.Vy,
            forces: [ship.thrust],
            mass: ship.mass,
        };
    }, (out: IAcceleratorOutputs) => {
        ship.Vx += out.dVx;
        ship.Vy += out.dVy;
    });
    return new SingleGameObject([thrust],[]);
}


export function createWeaponObject(getControls: () => IControls,
    getShip: () => IShip,
    getWeapon: () => IWeapon): MultiGameObject<SingleGameObject> {
    var weapon: IWeapon = getWeapon();
    // todo: change this to weapon (not getWeapon)
    let bulletObjs: SingleGameObject[] = weapon.bullets.map((b) => createBulletObject(() => b));
    var weaponObj: MultiGameObject<SingleGameObject> = new MultiGameObject([], [], () => bulletObjs);
    var age5: AgePred<IParticle> = new AgePred(
        () => weapon.bulletLifetime,
        (p: IParticle) => p.born
    );
    var remover: ParticleRemover = new ParticleRemover(
        () => {
            ParticleRemover.remove(
                () => weapon.bullets,
                weaponObj.getComponents,
                [age5]);
        });
    // add the generator to the field object
    weaponObj.actors.push(remover);

    var weaponController: IActor = createWeaponController(() => {
        return {
            fire: getControls().fire,
            ship: getShip(),
            weapon: getShip().weapon1,
        };
    }, (newParticle: IParticle) => {
        getShip().weapon1.bullets.push(newParticle);
        var bulletObj: SingleGameObject = createBulletObject(() => newParticle);
        weaponObj.getComponents().push(bulletObj);
    });
    weaponObj.actors.push(weaponController);
    return weaponObj;
}

function createBulletObject(getParticle: () => IParticle): SingleGameObject {
    var particle: IParticle = getParticle();
    var mover: IActor = new MoveConstVelocity(
        () => particle,
        (out: IMoveOut) => {
            particle.x += out.dx;
            particle.y += out.dy;
        }
    );
    var view: IView = new RectangleView(() => {
        return {
            x: particle.x,
            y: particle.y,
            width: particle.size,
            height: particle.size,
        };
    });
    let particleObj: SingleGameObject = new SingleGameObject([mover], [view]);
    var fireSound: IActor = new Sound("res/sound/raygun-01.mp3", true, false, () => {
        return {
            play: true,
        };
    });
    particleObj.actors.push(fireSound);
    return particleObj;
}

export function createExhaustObj(getShip: () => IShip): MultiGameObject<SingleGameObject> {
    var ship: IShip = getShip();
    var exhaustObj: MultiGameObject<SingleGameObject> = createParticleField(ship.exhaust.exhaustParticleField,
        () => {
            var velocity: Coordinate = Transforms.VectorToCartesian(ship.thrust.angle + Transforms.random(-5, 5) + 180,
                ship.thrust.length * 5 + Transforms.random(-5, 5));
            return {
                on: ship.exhaust.exhaustParticleField.on,
                x: ship.x,
                xOffset: ship.shape.offset.x,
                xLowSpread: -2,
                xHighSpread: 2,
                y: ship.y,
                yOffset: ship.shape.offset.y,
                yLowSpread: -2,
                yHighSpread: 2,
                Vx: velocity.x,
                vXLowSpread: 0,
                vXHighSpread: 0,
                Vy: velocity.y,
                vYLowSpread: 0,
                vYHighSpread: 0,
            };
        });
    var exhaustSound: IActor = new Sound(ship.exhaust.soundFilename, false, true, () => {
        return {
            play: ship.exhaust.exhaustParticleField.on,
        };
    });
    exhaustObj.actors.push(exhaustSound);
    return exhaustObj;
}

export function createExplosionObj(getShip: () => IShip): MultiGameObject<SingleGameObject> {
    var ship: IShip = getShip();
    var explosionObj: MultiGameObject<SingleGameObject>
        = createParticleField(ship.explosion.explosionParticleField,
            () => {
                return {
                    on: ship.explosion.explosionParticleField.on,
                    x: ship.x,
                    xOffset: ship.shape.offset.x,
                    xLowSpread: -2,
                    xHighSpread: 2,
                    y: ship.y,
                    yOffset: ship.shape.offset.y,
                    yLowSpread: -2,
                    yHighSpread: 2,
                    Vx: ship.Vx,
                    vXLowSpread: -10,
                    vXHighSpread: 10,
                    Vy: ship.Vy,
                    vYLowSpread: -10,
                    vYHighSpread: 10,
                };
            });
    var explosionSound: IActor = new Sound(ship.explosion.soundFilename, true, false, () => {
        return {
            play: ship.explosion.explosionParticleField.on,
        };
    });
    explosionObj.actors.push(explosionSound);
    var flashView: IView = new ScreenFlashView(() => {
        return {
            x: 0,
            y: 0,
            width: 480,
            height: 512,
            on: ship.crashed,
            value: ship.explosion.flash.flashScreenValue,
        };
    });
    explosionObj.views.push(flashView);
    // add flasher to value so screen changes
    var flasher: IActor = new Flasher(() => {
        return {
            enabled: ship.crashed,
            value: ship.explosion.flash.flashScreenValue,
            repeat: ship.explosion.flash.flashRepeat,
        };
    }, (value: number) => {
        ship.explosion.flash.flashScreenValue = value;
    });
    explosionObj.actors.push(flasher);
    var timerTurnOff: IActor = new Timer(() => {
        return {
            enabled: ship.crashed,
            limit: ship.explosion.explosionLifetime,
        };
    }, () => {
        ship.explosion.explosionParticleField.on = false;
        ship.explosion.exploded = true;
    });
    explosionObj.actors.push(timerTurnOff);
    return explosionObj;
}
