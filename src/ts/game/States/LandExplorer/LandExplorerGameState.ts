﻿import { DrawContext} from "ts/gamelib/1Common/DrawContext";
import { Keys, KeyStateProvider } from "ts/gamelib/1Common/KeyStateProvider";
import { IGameState } from "ts/gamelib/GameState/GameState";
import { IInteractor, Interactor } from "ts/gamelib/Interactors/Interactor";
import { Assets } from "ts/gamelib/1Common/Assets";
import { createLandExplorerData, ILandExplorerData } from "./createLandExplorerData";
import { ILandExplorerStateObjects, createLandExplorerStateObjects } from "./createLandExplorerStateObjects";
import { ObjectCollisionDetector } from "../../../gamelib/Interactors/ObjectCollisionDetector";
import { Shape } from "../../../gamelib/Data/Shape";

export function createLandExplorerGameState(assets: Assets, actx: AudioContext): LandExplorerGameState {
    var dataModel: ILandExplorerData = createLandExplorerData();
    var stateObjs: ILandExplorerStateObjects = createLandExplorerStateObjects(()=> dataModel);
    var landExplorerState: LandExplorerGameState = new LandExplorerGameState("Lander", assets, actx, dataModel, stateObjs);
    return landExplorerState;
}

export class LandExplorerGameState implements IGameState {

    interactors: IInteractor[];
    viewScale: number;
    zoom: number;
    exitState: boolean = false;

    constructor(public name: string,
        private assets: Assets,
        private actx: AudioContext,
        private state: ILandExplorerData,
        private stateObj: ILandExplorerStateObjects) {
        this.viewScale = 1;
        this.zoom = 1;

        // scene objects
        // this.surface = LandExplorerState.createPlanetSurfaceObject(new Coordinate(0, 0), player.chassisObj.model.physics);
        // this.landingPad = LandExplorerState.createLandingPadObject(this.surface);
        // this.ballObject = LandExplorerState.createBallObject(this.surface);
        // this.sceneObjects.push(this.surface, this.landingPad, this.ballObject,
        // this.player.chassisObj, this.player.thrustController, this.player.weaponController, this.player.explosionController.field);

        // gui Objects
        // this.velocityText = new TextObject("", new Coordinate(325, 50), "monospace", 12);
        // this.wind = LandExplorerState.createWindDirectionIndicator(new Coordinate(450, 50));
        // this.guiObjects.push(this.velocityText, this.wind, this.player.explosionController.screenFlash);

        var shipSurfaceDetector: IInteractor = new ObjectCollisionDetector(() => {
                return {
                    location: {x: 0, y: 0},
                    shape: new Shape(this.state.surface.points),
                };
            },
            this.state.ship, this.playerSurfaceCollision.bind(this));
        // var shipLandingPadDetector: IInteractor = new ObjectCollisionDetector(this.landingPad.model,
        // this.player.chassisObj.model.physics, this.playerLandingPadCollision.bind(this));
        // var windEffect: IInteractor = new Interactor(this.wind.model, this.player, this.windEffectCallback);
        this.interactors = [shipSurfaceDetector];
        // shipLandingPadDetector, windEffect];
    }

    update(lastDrawModifier : number): void {
        // this.velocityText.model.text = "Velocity: " + Math.abs(Math.round(this.player.chassisObj.model.physics.velY));
        this.stateObj.sceneObjs.forEach(x=>x.update(lastDrawModifier));
    }

    input(keys: KeyStateProvider, lastDrawModifier: number): void {
        if (keys.isKeyDown(Keys.UpArrow)) {
            this.state.controls.up = true;
        } else {
            this.state.controls.up = false;
        }
        if (keys.isKeyDown(Keys.LeftArrow)) {
            this.state.controls.left = true;
        } else {
            this.state.controls.left = false;
        }
        if (keys.isKeyDown(Keys.RightArrow)) {
            this.state.controls.right = true;
        } else {
            this.state.controls.right = false;
        }
        if (keys.isKeyDown(Keys.SpaceBar)) {
            this.state.controls.fire = true;
        } else {
            this.state.controls.fire = false;
        }
        if (keys.isKeyDown(Keys.Z)) {
            this.viewScale = 0.01;
        } else if (keys.isKeyDown(Keys.X)) {
            this.viewScale = -0.01;
        } else {
            this.viewScale = 0;
        }
        this.zoom *= 1 + this.viewScale;
        if (keys.isKeyDown(Keys.Esc)) {
            this.exitState = true;
        }
    }

    display(drawingContext : DrawContext): void {
        drawingContext.clear();

        // objects not affected by movement
        this.stateObj.views.forEach(x=>x.display(drawingContext));

        // scene objects
        drawingContext.save();
        let x: number = this.state.ship.x;
        let y: number = this.state.ship.y;
        // drawing origin moves to centre - ship location (when location > centre, origin moves left)
        drawingContext.translate(256 - x + x * (1 - this.zoom),
            (240 - y) + y * (1 - this.zoom));
        drawingContext.zoom(this.zoom, this.zoom);

        this.stateObj.sceneObjs.forEach(x=>x.display(drawingContext));

        drawingContext.restore();

    }

    sound(actx: AudioContext): void {
        //
    }

    tests(lastTestModifier: number): void {
        this.interactors.forEach(interactor => interactor.test(lastTestModifier));
    }

    // windEffectCallback(lastTestModifier: number, wind: WindModel, controller: SpaceShipController) {
    //     controller.chassisObj.model.physics.velX += wind.physics.value * lastTestModifier;
    // }

    // playerLandingPadCollision() {
    //     if (this.player.chassisObj.model.physics.velY > 0) {
    //         console.log("Land velocity: " + this.player.chassisObj.model.physics.velY);

    //         if (this.player.chassisObj.model.physics.velY > 20) {
    //             this.player.crash();
    //         }

    //         this.player.chassisObj.model.physics.velY = 0;
    //         this.player.chassisObj.model.physics.velX = 0;
    //     }
    // }

    playerSurfaceCollision(): void {
         this.state.ship.Vx = 0;
         this.state.ship.Vy = 0;
         this.state.ship.crashed = true;
     }

    returnState(): number {
        let s: number = undefined;
        if (this.exitState) {
            this.exitState = false;
            s = 0;
        }
        return s;
    }

    // static createLandingPadObject(surface: SingleGameObject): void {
    //     var placeIndex = Transforms.random(0, 50);
    //     var xy = surface.model.shape.points[placeIndex];
    //     var padModel = new LandingPadModel(new Coordinate(xy.x + surface.model.physics.location.x,
    //         xy.y + surface.model.physics.location.y));
    //     var padView: IView = new PolyView(() => { return {
    //         x: padModel.physics.location.x,
    //         y: padModel.physics.location.y,
    //         shape: padModel.shape,
    //     };});
    //     var obj = new SingleGameObject(padModel, [], [padView]);
    //     return obj;
    // }

    // static createBallObject(surface: SingleGameObject) {
    //     var placeIndex = Transforms.random(0, 50);
    //     var xy = surface.model.shape.points[placeIndex];
    //     var ballModel: IBallObject = {
    //         x: xy.x + surface.model.physics.location.x,
    //         y: xy.y + surface.model.physics.location.y-8,
    //         vx: 0,
    //         vy: 0,
    //         r: 8,
    //         mass: 1,
    //     };
    //     var ballView: IView = new CircleView(() => {
    //         return {
    //             x: ballModel.x,
    //             y: ballModel.y,
    //             r: ballModel.r,
    //         };
    //     });
    //     // not needed at this stage
    //     var mover: MoveConstVelocity = new MoveConstVelocity(
    //         ()=> {
    //             return {
    //                 vx: ballModel.Vx,
    //                 vy: ballModel.Vy,
    //             };
    //         }, (mOut: IMoveOut)=> {
    //             ballModel.x += mOut.dx;
    //             ballModel.y += mOut.dy;
    //         });
    //     var obj = new SingleGameObject(ballModel, [mover], [ballView]);
    //     return obj;
    // }

    // static createWindDirectionIndicator(location: Coordinate): SingleGameObject {
    //     var model: WindModel = new WindModel(location);
    //     var windGenerator: IActor = new WindGenerator(model.physics, model.shape);
    //     var viewArrow: IView = new PolyView(() => { return {
    //         x: model.physics.location.x,
    //         y: model.physics.location.y,
    //         shape: model.shape,
    //     };});
    //     var viewText: IView = new ValueView(model.physics, "{0} mph", "monospace", 12);
    //     var obj = new SingleGameObject(model, [windGenerator], [viewArrow, viewText]);
    //     return obj;
    // }
}