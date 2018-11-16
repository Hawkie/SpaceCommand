import { DrawPolyGraphicAngled } from "../../gamelib/Views/PolyGraphicAngled";
import { DrawContext } from "../../gamelib/1Common/DrawContext";
import { IAsteroid } from "../States/Asteroids/AsteroidState";
import { Game } from "../Game/Game";

export function DisplayAsteroid(ctx: DrawContext, asteroid: IAsteroid): void {
    DrawPolyGraphicAngled(ctx, asteroid.x + asteroid.shape.offset.x,
        asteroid.y + asteroid.shape.offset.y,
        asteroid.shape,
        asteroid.angle,
        Game.assets.terrain);
}