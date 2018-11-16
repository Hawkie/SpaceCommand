import { IMenu, UpdateMenu, SoundMenu, DisplayMenu } from "../../Components/MenuComponent";
import { IMenuControls, UpdateMenuControls } from "./MenuControlsComponent";
import { Game } from "../../Game/Game";
import { UpdateField, DisplayField, IParticleField, CreateField } from "../../Components/FieldComponent";
import { Transforms } from "../../../gamelib/Physics/Transforms";
import { DrawContext } from "../../../gamelib/1Common/DrawContext";
import { DisplayTitle } from "../../Components/TitleComponent";

export interface IMenuState {
    title: string;
    font: string;
    fontSize: number;
    starField1: IParticleField;
    starField2: IParticleField;
    menu: IMenu;
    control: IMenuControls;
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

export interface IStateAction {
    type: string;
    keys: number[];
}

// pure function
export function UpdateMenuState(timeModifier: number, state: IMenuState, action: IStateAction): IMenuState {
    switch (action.type) {
        case "UPDATE": {
            return Object.assign({}, state, {
                starField1: UpdateField(timeModifier, state.starField1, true, 2, (now: number) => {
                    return {
                        x: Transforms.random(0, 512),
                        y: 0,
                        Vx: 0,
                        Vy: Transforms.random(10, 30),
                        born: now,
                        size: 1,
                    };
                }),
                starField2: UpdateField(timeModifier, state.starField2, true, 3, (now: number) => {
                    return {
                        x: Transforms.random(0, 512),
                        y: 0,
                        Vx: 0,
                        Vy: Transforms.random(30, 50),
                        born: now,
                        size: 2,
                    };
                })
            });
        }
        case "INPUT": {
            let controls: IMenuControls = UpdateMenuControls(timeModifier, action.keys);
            return Object.assign({}, state, {
                control: controls,
                menu: UpdateMenu(timeModifier, state.menu, controls)
            });
        }
        case "SOUND": {
            return Object.assign({}, state, {
                menu: SoundMenu(state.menu, Game.assets.timePortal, Game.assets.blast)
            });
        }
        default: return Object.assign({}, state);
    }
}