import { IParticleField } from "../Asteroids/createAsteroidData";
import { IMenu } from "./MenuComponent";
import { IMenuControl } from "./KeysComponent";
import { IMenuSound } from "./SoundComponent";

export interface IMenuState {
    sound: IMenuSound;
    title: string;
    font: string;
    fontSize: number;
    starField1: IParticleField;
    starField2: IParticleField;
    menu: IMenu;
    control: IMenuControl;

}
export function createMenuData(): IMenuState {
    return {
        sound: {
            musicFilename: "res/sound/TimePortal.mp3",
            playing: false,
        },
        title: "Menu",
        font: "Arial",
        fontSize: 18,
        starField1: {
            particles: [],
            accumulatedModifier: 0,
            toAdd: 0,
            particlesPerSecond: 2,
            maxParticlesPerSecond: 2,
            particleLifetime: 40,
            particleSize: 1,
            on: true,
            gravityStrength: 0,
        },
        starField2: {
            particles: [],
            accumulatedModifier: 0,
            toAdd: 0,
            particlesPerSecond: 2,
            maxParticlesPerSecond: 2,
            particleLifetime: 20,
            particleSize: 2,
            on: true,
            gravityStrength: 0,
        },
        menu: {
            lastMoved: 0,
            selected: false,
            itemFocus: 0,
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