import { IShip, CreateShip, CrashShip, DisplayShip, ShipCopyToUpdated, ShipSounds } from "../../Components/Ship/ShipComponent";
import { ISurfaceGeneration, ISurface, initSurface, DisplaySurface, addSurface } from "../../Components/SurfaceComponent";
import { IParticleField, CreateField } from "../../Components/FieldComponent";
import { IAsteroidsControls, InputAsteroidControls, CreateControls } from "../../Components/AsteroidsControlsComponent";
import { KeyStateProvider } from "../../../gamelib/1Common/KeyStateProvider";
import { DrawContext } from "../../../gamelib/1Common/DrawContext";
import { DisplayField, FieldGenMove } from "../../../gamelib/Components/ParticleFieldComponent";
import { Transforms } from "../../../gamelib/Physics/Transforms";
import { Game2 } from "../../../gamelib/1Common/Game2";

export interface ILandExplorerState {
    readonly title: string;
    readonly controls: IAsteroidsControls;
    readonly ship: IShip;
    readonly starField: IParticleField;
    readonly surface: ISurface;
}

export function CreateLandExplorer(ship: IShip, starfield: IParticleField, surface: ISurface): ILandExplorerState {
    return {
        title: "Space Commander",
        controls: CreateControls(),
        ship: ship,
        starField: starfield,
        surface: surface,
    };
}

export function DisplayLandExplorer(ctx: DrawContext, state: ILandExplorerState): void {
    DisplayShip(ctx, state.ship);
    DisplayField(ctx, state.starField.particles);
    DisplaySurface(ctx, state.surface);
}

export function LandExplorerSounds(state: ILandExplorerState): ILandExplorerState {
    ShipSounds(state.ship);
    // turn off any sound triggers - need to think about this
    return state;
}

export function StateCopyToUpdate(state: ILandExplorerState, timeModifier: number): ILandExplorerState {
    return {...state,
        ship: ShipCopyToUpdated(timeModifier, state.ship, state.controls),
        starField: FieldGenMove(timeModifier, state.starField, true, 2, (now: number) => {
            return {
                x: Transforms.random(0, Game2.assets.width),
                y: 0,
                Vx: 0,
                Vy: Transforms.random(10, 30),
                born: now,
                size: 1,
            };
        }),
        surface: addSurface(state.surface, state.ship.x, Game2.assets.width, state.surface.surfaceGenerator)
    };
}

export function StateCopyToControls(state: ILandExplorerState, keys: KeyStateProvider): ILandExplorerState {
    return {...state,
        controls: InputAsteroidControls(keys.getKeys())
    };
}

export function TestPlayerHit(state: ILandExplorerState): ILandExplorerState {
    if (Transforms.hasPoint(state.surface.points.map(p => p), { x: 0, y: 0 }, state.ship)) {
            return {...state,
                ship: CrashShip(state.ship, 0, 0)
        };
    }
    return state;
}