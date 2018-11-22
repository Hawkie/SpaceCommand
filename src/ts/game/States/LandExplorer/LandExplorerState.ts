import { IShip, CreateShip, ShipCopyToCrashedShip, DisplayShip, ShipCopyToUpdated } from "../../Components/Ship/ShipComponent";
import { ISurfaceGeneration, ISurface, initSurface, DisplaySurface } from "../../Components/SurfaceComponent";
import { IParticleField, CreateField } from "../../Components/FieldComponent";
import { IAsteroidsControls, InputAsteroidControls } from "../../Components/AsteroidsControlsComponent";
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
        controls: {
            left: false,
            right: false,
            up: false,
            fire: false,
            zoomIn: false,
            zoomOut: false,
            exit: false,
        },
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
    if (state.ship.crashed) {
        Game.assets.explosion.playOnce();
    }
    if (state.ship.exhaust.thrustOn) {
        Game.assets.thrust.play();
    } else {
        Game.assets.thrust.pause();
    }
    if (state.ship.weapon1.fired) {
        Game.assets.gun.replay();
    }
    // turn off any sound triggers - need to think about this
    return state;
}

export function StateCopyToUpdate(state: ILandExplorerState, timeModifier: number): ILandExplorerState {
    return {...state,
        ship: ShipCopyToUpdated(timeModifier, state.ship, state.controls)
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