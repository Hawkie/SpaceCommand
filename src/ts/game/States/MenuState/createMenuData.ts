import { IParticleField } from "../Asteroids/createAsteroidData";
import { IAudioObject, AudioObject } from "../../../gamelib/Sound/SoundObject";

export interface IMenu {
    lastMoved: number;
    selected: boolean;
    itemFocus: number;
    menuItems: string[];
    originalItems: string[];
}

export interface IMenuControl {
    up: boolean;
    down: boolean;
    enter: boolean;
}

export interface IMenuSound {
    musicFilename: string;
    playing: boolean;
}

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
            menuItems: ["Asteroids", "Lander"],
            originalItems: ["Asteroids", "Lander"],
        },
        control: {
            up: false,
            down: false,
            enter: false,
        }
    };
}