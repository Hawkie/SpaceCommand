import { IAsteroid, CreateAsteroidData, DisplayAsteroid, UpdateAsteroid } from "./AsteroidComponent";
import { IAsteroidStateStatic } from "../../States/Asteroids/AsteroidGameStatic";
import { DrawContext } from "../../../gamelib/1Common/DrawContext";
import { Game } from "../../Game/Game";

export interface IAsteroids {
    readonly asteroids: ReadonlyArray<IAsteroid>;
    readonly asteroidHit: boolean;
}

export function CreateAsteroids(asteroidStateStatic: IAsteroidStateStatic, level: number): IAsteroid[] {
    let asteroids: IAsteroid[] = [];
    for (let i: number = 0; i < level; i++) {
        let a: IAsteroid = CreateAsteroidData(asteroidStateStatic, 3);
        asteroids.push(a);
    }
    return asteroids;
}

export function DisplayAsteroids(ctx: DrawContext, asteroids: IAsteroids): void {
    asteroids.asteroids.forEach((a)=> DisplayAsteroid(ctx, a, Game.assets.terrain));
}

export function UpdateAsteroids(timeModifier: number, asteroids: IAsteroids): IAsteroids {
    return {...asteroids,
        asteroids: asteroids.asteroids.map(a => UpdateAsteroid(timeModifier, a))
    };
}