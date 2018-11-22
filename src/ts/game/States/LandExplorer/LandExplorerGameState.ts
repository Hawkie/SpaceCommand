import { DrawContext} from "../../../gamelib/1Common/DrawContext";
import { Keys, KeyStateProvider } from "../../../gamelib/1Common/KeyStateProvider";
import { IGameState } from "../../../gamelib/GameState/GameState";
import { IInteractor, Interactor } from "../../../gamelib/Interactors/Interactor";
import { CreateLandExplorer, ILandExplorerState, StateCopyToControls,
    StateCopyToPlayerHit, StateCopyToUpdate, DisplayLandExplorer, Sound } from "./LandExplorerState";
import { ObjectCollisionDetector } from "../../../gamelib/Interactors/ObjectCollisionDetector";
import { Shape } from "../../../gamelib/DataTypes/Shape";
import { CreateShip, IShip, DisplayShip } from "../../Components/Ship/ShipComponent";
import { ICoordinate } from "../../../gamelib/DataTypes/Coordinate";
import { initSurface, ISurface, ISurfaceGeneration } from "../../Components/SurfaceComponent";
import { IParticleField, CreateField } from "../../Components/FieldComponent";
import { Game } from "../../Game/Game";
import { DisplayTitle } from "../../Components/TitleComponent";
import { Transforms } from "../../../gamelib/Physics/Transforms";
import { MoveShip } from "../../Components/Ship/MovementComponent";

export function createLandExplorerGameState(): LandExplorerGameState {
    let surfaceGenerator: ISurfaceGeneration = {
        resolution: 5,
        upper: 5,
        lower: -5,
    };
    let ship: IShip = CreateShip(Game.assets.width/2, Game.assets.height/2, 10, false,
        MoveShip);
    let points: ICoordinate[] = initSurface(Game.assets.width, surfaceGenerator);
    let surface: ISurface = {
        addedLeft: 0,
        points: points,
        surfaceGenerator: surfaceGenerator,
    };
    let starfield: IParticleField = CreateField(true, 1, 1);
    let state: ILandExplorerState = CreateLandExplorer(ship, starfield, surface);
    let landExplorerState: LandExplorerGameState = new LandExplorerGameState("Lander", state);
    return landExplorerState;
}

export class LandExplorerGameState implements IGameState {

    interactors: IInteractor[];
    viewScale: number;
    zoom: number;

    constructor(public name: string,
        private state: ILandExplorerState) {
        this.viewScale = 1;
        this.zoom = 1;

        // scene objects
        // this.surface = LandExplorerState.createPlanetSurfaceObject(new Coordinate(0, 0), player.chassisObj.model.physics);
        // this.landingPad = LandExplorerState.createLandingPadObject(this.surface);
        // this.ballObject = LandExplorerState.createBallObject(this.surface);
        // this.sceneObjects.push(this.surface, this.landingPad, this.ballObject,

        // gui Objects
        // this.velocityText = new TextObject("", new Coordinate(325, 50), "monospace", 12);
        // this.wind = LandExplorerState.createWindDirectionIndicator(new Coordinate(450, 50));
        // this.guiObjects.push(this.velocityText, this.wind, this.player.explosionController.screenFlash);

        // let shipLandingPadDetector: IInteractor = new ObjectCollisionDetector(this.landingPad.model,
        // this.player.chassisObj.model.physics, this.playerLandingPadCollision.bind(this));
        // let windEffect: IInteractor = new Interactor(this.wind.model, this.player, this.windEffectCallback);
        // this.interactors = [shipSurfaceDetector];
        // shipLandingPadDetector, windEffect];
    }

    update(timeModifier : number): void {
        // this.velocityText.model.text = "Velocity: " + Math.abs(Math.round(this.player.chassisObj.model.physics.velY));
        // this.stateObj.sceneObjs.forEach(x => x.update(lastDrawModifier));
        // this.stateObj.backgroundObjs.forEach(b => b.update(lastDrawModifier));
        this.state = StateCopyToUpdate(this.state, timeModifier);
    }

    input(keys: KeyStateProvider, lastDrawModifier: number): void {
        this.state = StateCopyToControls(this.state, keys);
    }

    display(ctx : DrawContext): void {
        ctx.clear();

        // objects not affected by movement. e.g GUI
        DisplayTitle(ctx, this.state.title);

        // move screen to ship location, and draw to screen everything relative from there.
        ctx.save();
        let x: number = this.state.ship.x;
        let y: number = this.state.ship.y;
        if (this.state.controls.zoomIn) {
            this.viewScale = 0.01;
        } else if (this.state.controls.zoomOut) {
            this.viewScale = -0.01;
        } else {
            this.viewScale = 0;
        }
        this.zoom *= 1 + this.viewScale;
        // drawing origin moves to centre - ship location (when location > centre, origin moves left)
        ctx.translate(Game.assets.width/2 - x + x * (1 - this.zoom),
            Game.assets.height/2 - y + y * (1 - this.zoom));
        ctx.zoom(this.zoom, this.zoom);
        DisplayShip(ctx, this.state.ship);
        DisplayLandExplorer(ctx, this.state);
        ctx.restore();
    }

    sound(timeModifier: number): void {
        this.state = Sound(this.state);
    }

    tests(lastTestModifier: number): void {
        if (Transforms.hasPoint(this.state.surface.points.map(p => p),
            { x: 0, y: 0 },
            this.state.ship)) {
                this.state = StateCopyToPlayerHit(this.state, 0, 0);
        }
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

    returnState(): number {
        let s: number = undefined;
        if (this.state.controls.exit) {
            s = 0;
        }
        return s;
    }

    // static createLandingPadObject(surface: SingleGameObject): void {
    //     let placeIndex = Transforms.random(0, 50);
    //     let xy = surface.model.shape.points[placeIndex];
    //     let padModel = new LandingPadModel(new Coordinate(xy.x + surface.model.physics.location.x,
    //         xy.y + surface.model.physics.location.y));
    //     let padView: IView = new PolyView(() => { return {
    //         x: padModel.physics.location.x,
    //         y: padModel.physics.location.y,
    //         shape: padModel.shape,
    //     };});
    //     let obj = new SingleGameObject(padModel, [], [padView]);
    //     return obj;
    // }

    // static createBallObject(surface: SingleGameObject) {
    //     let placeIndex = Transforms.random(0, 50);
    //     let xy = surface.model.shape.points[placeIndex];
    //     let ballModel: IBallObject = {
    //         x: xy.x + surface.model.physics.location.x,
    //         y: xy.y + surface.model.physics.location.y-8,
    //         vx: 0,
    //         vy: 0,
    //         r: 8,
    //         mass: 1,
    //     };
    //     let ballView: IView = new CircleView(() => {
    //         return {
    //             x: ballModel.x,
    //             y: ballModel.y,
    //             r: ballModel.r,
    //         };
    //     });
    //     // not needed at this stage
    //     let mover: MoveConstVelocity = new MoveConstVelocity(
    //         ()=> {
    //             return {
    //                 vx: ballModel.Vx,
    //                 vy: ballModel.Vy,
    //             };
    //         }, (mOut: IMoveOut)=> {
    //             ballModel.x += mOut.dx;
    //             ballModel.y += mOut.dy;
    //         });
    //     let obj = new SingleGameObject(ballModel, [mover], [ballView]);
    //     return obj;
    // }

    // static createWindDirectionIndicator(location: Coordinate): SingleGameObject {
    //     let model: WindModel = new WindModel(location);
    //     let windGenerator: IActor = new WindGenerator(model.physics, model.shape);
    //     let viewArrow: IView = new PolyView(() => { return {
    //         x: model.physics.location.x,
    //         y: model.physics.location.y,
    //         shape: model.shape,
    //     };});
    //     let viewText: IView = new ValueView(model.physics, "{0} mph", "monospace", 12);
    //     let obj = new SingleGameObject(model, [windGenerator], [viewArrow, viewText]);
    //     return obj;
    // }
}