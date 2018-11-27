import { IMenuComponent, UpdateMenu, SoundMenu, DisplayMenu } from "../../Components/MenuComponent";
import { IMenuControls, UpdateMenuControls } from "./MenuControlsComponent";
import { IParticleField, CreateField } from "../../Components/FieldComponent";
import { Transforms } from "../../../gamelib/Physics/Transforms";
import { DrawContext } from "../../../gamelib/1Common/DrawContext";
import { DisplayTitle } from "../../Components/TitleComponent";
import { DisplayField, FieldGenMove } from "../../../gamelib/Components/ParticleFieldComponent";
import { KeyStateProvider } from "../../../gamelib/1Common/KeyStateProvider";
import { IStateProcessor } from "../../../gamelib/1Common/StateProcessor";
import { Game2 } from "../../../gamelib/1Common/Game2";

export interface IMenuState {
    readonly title: string;
    readonly font: string;
    readonly fontSize: number;
    readonly starField1: IParticleField;
    readonly starField2: IParticleField;
    readonly menu: IMenuComponent;
    readonly control: IMenuControls;
}

// when creating a game state - create the data and then bind to the objects
export function CreateGameStateMenu(): IStateProcessor<IMenuState> {
    return {
        id: 0,
        name: "Main Menu",
        sound: SoundMenuState,
        display: DisplayMenuState,
        input: InputMenuState,
        update: UpdateMenuState,
        next: (state: IMenuState) => {
            if (state.menu.selected) {
                return state.menu.itemFocus;
            }
            return undefined;
        }
    };
}

export function CreateMenuState(): IMenuState {
    return {
        title: "Menu",
        font: "Arial",
        fontSize: 18,
        starField1: CreateField(true, 2, 2, 1),
        starField2: CreateField(true, 2, 2, 2),
        menu: {
            lastMoved: 0,
            selected: false,
            itemFocus: 0,
            moved: false,
            font: "Arial",
            fontSize: 16,
            menuItems: ["Asteroids", "Lander"],
        },
        control: {
            up: false,
            down: false,
            enter: false,
        }
    };
}

// map whole state to view/ctx functions
export function DisplayMenuState(ctx: DrawContext, state: IMenuState): void {
    ctx.clear();
    DisplayField(ctx, state.starField1.particles);
    DisplayField(ctx, state.starField2.particles);
    DisplayTitle(ctx, state.title);
    DisplayMenu(ctx, 200, 100, state.menu);
}

export function UpdateMenuState(state:IMenuState, timeModifier: number): IMenuState {
    return {...state,
        starField1: FieldGenMove(timeModifier, state.starField1, true, 2, (now: number) => {
            return {
                x: Transforms.random(0, 512),
                y: 0,
                Vx: 0,
                Vy: Transforms.random(10, 30),
                born: now,
                size: 1,
            };
        }),
        starField2: FieldGenMove(timeModifier, state.starField2, true, 3, (now: number) => {
            return {
                x: Transforms.random(0, 512),
                y: 0,
                Vx: 0,
                Vy: Transforms.random(30, 50),
                born: now,
                size: 2,
            };
        }),
    };
}

export function SoundMenuState(state: IMenuState): IMenuState {
    return {...state,
        menu: SoundMenu(state.menu, Game2.assets.timePortal, Game2.assets.blast)
    };
}

export function InputMenuState(menuState: IMenuState, keys: KeyStateProvider, timeModifier: number): IMenuState  {
    let controls: IMenuControls = UpdateMenuControls(timeModifier, keys.getKeys());
    return {...menuState,
        control: controls,
        menu: UpdateMenu(menuState.menu, controls)
    };
}