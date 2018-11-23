import { DrawContext} from "../../../gamelib/1Common/DrawContext";
import { Keys, KeyStateProvider } from "../../../gamelib/1Common/KeyStateProvider";
import { CreateLandExplorer, ILandExplorerState, StateCopyToControls,
    StateCopyToUpdate, DisplayLandExplorer, LandExplorerSounds, TestPlayerHit } from "./LandExplorerState";
import { CreateShip, IShip, DisplayShip } from "../../Components/Ship/ShipComponent";
import { ICoordinate } from "../../../gamelib/DataTypes/Coordinate";
import { initSurface, ISurface, ISurfaceGeneration } from "../../Components/SurfaceComponent";
import { IParticleField, CreateField } from "../../Components/FieldComponent";
import { Game } from "../../Game/Game";
import { DisplayTitle } from "../../Components/TitleComponent";
import { Transforms } from "../../../gamelib/Physics/Transforms";
import { MoveShip } from "../../Components/Ship/MovementComponent";
import { CreateView, IView, DisplayView, Zoom } from "../../Components/ViewPortComponent";
import { IGameState } from "../../../gamelib/GameState/GameState";

export interface ILandExplorerGameState {
    name: string;
    state: ILandExplorerState;
    view: IView;
}

export function CreateGameStateLandExplorer(): ILandExplorerGameState {
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
    let view: IView = CreateView(true);
    return {
        name: "LanderExplorer",
        state: state,
        view: view,
    };
}

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
    let view: IView = CreateView(true);
    let landExplorerState: LandExplorerGameState = new LandExplorerGameState("Lander", state, view);
    return landExplorerState;
}

export class LandExplorerGameState implements ILandExplorerGameState, IGameState {

    constructor(public name: string,
        public state: ILandExplorerState,
        public view: IView) {

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
        // shipLandingPadDetector, windEffect];
    }

    update(timeModifier : number): void {
        // this.velocityText.model.text = "Velocity: " + Math.abs(Math.round(this.player.chassisObj.model.physics.velY));
        // this.stateObj.sceneObjs.forEach(x => x.update(lastDrawModifier));
        // this.stateObj.backgroundObjs.forEach(b => b.update(lastDrawModifier));
        this.state = StateCopyToUpdate(this.state, timeModifier);
        this.view = Zoom(this.view, this.state.controls.zoomIn, this.state.controls.zoomOut);
    }

    input(keys: KeyStateProvider, lastDrawModifier: number): void {
        this.state = StateCopyToControls(this.state, keys);
    }

    display(ctx : DrawContext): void {
        ctx.clear();

        // objects not affected by movement. e.g GUI
        DisplayTitle(ctx, this.state.title);
        DisplayView(ctx, this.view, this.state.ship.x, this.state.ship.y, this.state, {displayState: DisplayLandExplorer});
    }

    sound(timeModifier: number): void {
        this.state = LandExplorerSounds(this.state);
    }

    tests(lastTestModifier: number): void {
        this.state = TestPlayerHit(this.state);
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
        if (this.state.controls.exit) {
            return 0; // menu state is id = 0
        }
        return undefined;
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

export function Update(state: ILandExplorerGameState, timeModifier: number): ILandExplorerGameState {
    let newState: ILandExplorerState = state.state;
    newState = StateCopyToUpdate(state.state, timeModifier);
    newState = LandExplorerSounds(state.state);
    newState = TestPlayerHit(state.state);
    return {...state,
        state: newState,
        view: Zoom(this.view, this.state.controls.zoomIn, this.state.controls.zoomOut)
    };
}

export function Input(state: ILandExplorerGameState, keys: KeyStateProvider): ILandExplorerGameState {
    return {...state,
        state: StateCopyToControls(state.state, keys)
    };
}

export function Display(ctx: DrawContext, state: ILandExplorerGameState): void {
    ctx.clear();
    // objects not affected by movement. e.g GUI
    DisplayTitle(ctx, state.state.title);
    DisplayView(ctx, state.view, state.state.ship.x, state.state.ship.y, state.state, {displayState: DisplayLandExplorer});
}
