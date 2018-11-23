import { IShip, CreateShip, ShipCopyToCrashedShip, DisplayShip, ShipCopyToUpdated, ShipSounds } from "../../Components/Ship/ShipComponent";
import { ISurfaceGeneration, ISurface, initSurface, DisplaySurface, addSurface } from "../../Components/SurfaceComponent";
import { IParticleField, CreateField } from "../../Components/FieldComponent";
import { IAsteroidsControls, InputAsteroidControls, CreateControls } from "../../Components/AsteroidsControlsComponent";
import { KeyStateProvider } from "../../../gamelib/1Common/KeyStateProvider";
import { DrawContext } from "../../../gamelib/1Common/DrawContext";
import { Game } from "../../Game/Game";
import { DisplayField } from "../../../gamelib/Components/ParticleFieldComponent";

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
        DisplayField(ctx, state.starField.particles);
        DisplaySurface(ctx, state.surface);
}

export function Sound(state: ILandExplorerState): ILandExplorerState {
    ShipSounds(state.ship);
    // turn off any sound triggers - need to think about this
    return state;
}

export function StateCopyToUpdate(state: ILandExplorerState, timeModifier: number): ILandExplorerState {
    return {...state,
        ship: ShipCopyToUpdated(timeModifier, state.ship, state.controls),
        surface: addSurface(state.surface, state.ship.x, Game.assets.width, state.surface.surfaceGenerator)
    };
}

export function StateCopyToControls(state: ILandExplorerState, keys: KeyStateProvider): ILandExplorerState {
    return {...state,
        controls: InputAsteroidControls(keys.getKeys())
    };
}

export function StateCopyToPlayerHit(state: ILandExplorerState, Vx: number, Vy: number): ILandExplorerState {
    return {...state,
        ship: ShipCopyToCrashedShip(state.ship, Vx, Vy)
    };
}