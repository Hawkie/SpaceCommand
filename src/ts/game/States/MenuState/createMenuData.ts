import { IParticleField } from "../Asteroids/createAsteroidData";

export interface IMenuData {
    musicFilename: string;
    title: string;
    font: string;
    fontSize: number;
    starField1: IParticleField;
    starField2: IParticleField;
    menuItems: string[];
    originalItems: string[];
}
export function createMenuData(): IMenuData {
    return {
        musicFilename: "res/sound/TimePortal.mp3",
        title: "Menu",
        font: "Arial",
        fontSize: 18,
        starField1: {
            particles: [],
            particlesPerSecond: 2,
            maxParticlesPerSecond: 2,
            particleLifetime: 40,
            particleSize: 1,
            on: true,
            gravityStrength: 0,
        },
        starField2: {
            particles: [],
            particlesPerSecond: 2,
            maxParticlesPerSecond: 2,
            particleLifetime: 20,
            particleSize: 2,
            on: true,
            gravityStrength: 0,
        },
        menuItems: ["Asteroids", "Lander"],
        originalItems: [],
    };
}