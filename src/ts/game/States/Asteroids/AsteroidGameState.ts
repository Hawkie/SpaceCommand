import { DrawContext} from "../../../gamelib/1Common/DrawContext";
import { KeyStateProvider } from "../../../gamelib/1Common/KeyStateProvider";
import { IAsteroidsState, CreateAsteroidsState, DisplayAsteroidsState,
    SoundAsteroidsState, InputAsteroidsState,
    UpdateAsteroidsState } from "./AsteroidState";
import { CreateShip, IShip } from "../../Components/Ship/ShipComponent";
import { IParticleField, CreateField } from "../../Components/FieldComponent";
import { MoveAttachedShip } from "../../Components/Ship/MovementComponent";
import { CreateView, IView, DisplayView, Zoom } from "../../Components/ViewPortComponent";

export interface IAsteroidsGameState {
    view: IView;
    asteroidsState: IAsteroidsState;
}

export function CreateAsteroidsGameState(): IAsteroidsGameState {
    // let spriteField: IGameObject = createSpriteField();

    let ship: IShip = CreateShip(256, 240, 0, true, MoveAttachedShip);
    let starfield: IParticleField = CreateField(true, 1, 1, 1);
    let state: IAsteroidsState = CreateAsteroidsState(ship, starfield);
    let view: IView = CreateView(false);
    let asteroidState: IAsteroidsGameState = {
        asteroidsState: state,
        view: view,
    };
    return asteroidState;
}

export function DisplayAsteroidsGameState(ctx: DrawContext, state: IAsteroidsGameState): void {
    ctx.clear();
    DisplayView(ctx, state.view,
        state.asteroidsState.ship.x,
        state.asteroidsState.ship.y,
        state.asteroidsState, { displayState: DisplayAsteroidsState });
}

export function SoundsAsteroidsGameState(state: IAsteroidsGameState): IAsteroidsGameState {
    return {...state,
        asteroidsState: SoundAsteroidsState(state.asteroidsState)
    };
}

export function InputAsteroidsGameState(state: IAsteroidsGameState, keys: KeyStateProvider): IAsteroidsGameState {
    return {...state,
        asteroidsState: InputAsteroidsState(state.asteroidsState, keys)
    };
}

export function UpdateAsteroidsGameState(state: IAsteroidsGameState, timeModifier: number): IAsteroidsGameState {
    let subState: IAsteroidsState = state.asteroidsState;
    subState = SoundAsteroidsState(subState);
    subState = UpdateAsteroidsState(timeModifier, subState);
    return {...state,
        asteroidsState: subState,
        view: state.view = Zoom(state.view, state.asteroidsState.controls.zoomIn, state.asteroidsState.controls.zoomOut),
    };
}

