import { DrawContext} from "../../../gamelib/1Common/DrawContext";
import { IGameState } from "../../../gamelib/GameState/GameState";
import { Keys, KeyStateProvider } from "../../../gamelib/1Common/KeyStateProvider";
import { createMenuData, IMenuState, IMenu, IMenuControl, IMenuSound } from "./createMenuData";
import { IParticle } from "../../Objects/Particle/IParticle";
import { DisplayRectangle } from "../../../gamelib/Views/RectangleView";
import { DrawText } from "../../../gamelib/Views/TextView";
import { IParticleField } from "../Asteroids/createAsteroidData";
import { GenerateParticles } from "../../../gamelib/Actors/ParticleGenerator2";
import { Transforms } from "../../../gamelib/Physics/Transforms";
import { IAudioObject, AudioObject } from "../../../gamelib/Sound/SoundObject";


// when creating a game state - create the data and then bind to the objects
export function createMenuState2(): MenuState2 {

    return new MenuState2("Menu", createMenuData());
}

// map whole state to view/ctx functions
export function stateToView(ctx: DrawContext, state: IMenuState): void {
    ctx.clear();
    fieldToView(ctx, state.starField1.particles);
    fieldToView(ctx, state.starField2.particles);
    titleToView(ctx, state.title);
    menuItemsToView(ctx, 200, 100, state.menu.menuItems, state.font, state.fontSize);
}

// map field data (particles[]) to particle view
export function fieldToView(ctx: DrawContext, particles: IParticle[]): void {
    particles.forEach(p => particleToView(ctx, p));
}

// map title to text view
export function titleToView(ctx: DrawContext, title: string): void {
    DrawText(ctx, 10, 20, title, "Arial", 18);
}

// takes particle data and maps to rectangle data.
export function particleToView(ctx: DrawContext, p: IParticle): void {
    DisplayRectangle(ctx, p.x, p.y, p.size, p.size);
}

export function menuItemsToView(ctx: DrawContext, x: number, y: number, menuItems: string[], font: string, fontSize: number): void {
    // todo: crude for loop
    for (let i: number = 0; i < menuItems.length; i++) {
        DrawText(ctx, x, y, menuItems[i], font, fontSize);
        y += 50;
    }
}

export function stateToAudio(audio: IAudioObject, playing: boolean): boolean {
    if (audio.ready) {
        if (!playing) {
            audio.play();
        }
        return true;
    }
    return false;
}

export interface IStateAction {
    type: string;
    keys: number[];
    soundPlaying: boolean;
}

// pure function
export function reduceState(timeModifier: number, state: IMenuState, action: IStateAction): IMenuState {
    switch (action.type) {
        case "UPDATE": {
            return Object.assign({}, state, {
                starField1: MoveParticleField(timeModifier,
                    AddToParticleField(timeModifier,
                        GenerationCheck(timeModifier, state.starField1))),
                starField2: MoveParticleField(timeModifier,
                    AddToParticleField(timeModifier,
                        GenerationCheck(timeModifier, state.starField2))),
            });
        }
        case "INPUT": {
            let controls: IMenuControl = reduceKeys(timeModifier, action.keys);
            return Object.assign({}, state, {
                control: controls,
                menu: reduceMenu(timeModifier, state.menu, controls)
            });
        }
        case "SOUND": {
            return Object.assign({}, state, {
                sound: reduceSound(timeModifier, state.sound, action.soundPlaying)
            });
        }
        default: return Object.assign({}, state);
    }
}


// export function reducerParticleField2<A>(particleField: IParticleField, action: A): IParticleField {
// }

// move

// pure function
export function MoveParticleField(timeModifier: number, particleField: IParticleField): IParticleField {
    let newParticles: IParticle[] = MoveParticles(timeModifier, particleField.particles);
    return Object.assign({}, particleField, {
        particles: newParticles
    });
}

// pure function
export function MoveParticles(timeModifier: number, particles: IParticle[]): IParticle[] {
    return particles.map((p)=> MoveParticle(timeModifier, p));
}

// pure function
export function MoveParticle(timeModifier: number, particle: IParticle): IParticle {
    return Object.assign({}, particle, {
        x: particle.x + (particle.Vx * timeModifier),
        y: particle.y + (particle.Vy * timeModifier),
    });
}


// add
export function AddToParticleField(timeModifier: number, starField: IParticleField): IParticleField {
    return Object.assign({}, starField, {
        particles: AddParticles(starField.particles,
            GenerateNewParticles(timeModifier, starField))
    });
}

export function GenerationCheck(timeModifier: number, starField: IParticleField): IParticleField {
    let accumulatedTime: number = starField.accumulatedModifier;
    let toAdd: number = 0;
    if (starField.on) {
        accumulatedTime += timeModifier;
        let a: number = starField.particlesPerSecond * accumulatedTime;
        toAdd = Math.floor(a);
        if (toAdd > 0) {
            // reset - but could make this better.
            let remainder: number = (a - toAdd)/starField.particlesPerSecond;
            accumulatedTime = remainder;
        }
    }
    return Object.assign({}, starField, {
        accumulatedModifier: accumulatedTime,
        toAdd: toAdd,
    });
}

// generate actions are pure functions
export function GenerateNewParticles(timeModifier: number, inputField: IParticleField): IParticle[] {
    // find the integer number of particles to add. conservatively round down
    let newParticles: IParticle[] = GenerateParticles(timeModifier, inputField.toAdd,
        (now: number) => {
            let p: IParticle = {
                x: Transforms.random(0, 512),
                y: 0,
                Vx: 0,
                Vy: Transforms.random(10, 50),
                born: now,
                size: inputField.particleSize,
        };
        return p;
    });
    return newParticles;
}

// pure functions - create new
export function AddParticles(particles: IParticle[], toAdd: IParticle[]): IParticle[] {
    return particles.concat(toAdd);
}

// pure functions - create new
export function reducerRemoveParticles(particles: IParticle[], toRemove: number[]): IParticle[] {
    return particles;
}

export function reduceKeys(timeModifier: number, keys: number[]): IMenuControl {
    let controls: IMenuControl = {
        up: false,
        down: false,
        enter: false,
    };
    if (keys.indexOf(Keys.UpArrow) > -1) {
        controls.up = true;
    }
    if (keys.indexOf(Keys.DownArrow) > -1) {
        controls.down = true;
    }
    if (keys.indexOf(Keys.Enter) > -1) {
        controls.enter = true;
    }
    return controls;
}


// pure fucntion that takes a menu action and updates the selected text. returns new menu
export function reduceMenu(timeModifier: number, menu: IMenu, controls: IMenuControl): IMenu {
    let now: number = Date.now();
    let focus: number = menu.itemFocus;
    if ((now - menu.lastMoved) > 150) {
        if (controls.up) {
            focus = Math.max(menu.itemFocus - 1, 0);
        }
        if (controls.down) {
            focus = Math.min(menu.itemFocus + 1, menu.menuItems.length - 1);
        }
        let menuItems: string[] = [];
        for (let i: number = 0; i < menu.originalItems.length; i++) {
            if (i === focus) {
                menuItems.push("<" + menu.originalItems[i] + ">");
            } else {
                menuItems.push(" " + menu.originalItems[i] + " ");
            }
        }
        // change state of menu focus
        return Object.assign({}, menu, {
            itemFocus: focus,
            selected: controls.enter,
            menuItems: menuItems,
            lastMoved: now,
        });
    }
    // return copy of menmu
    return Object.assign({}, menu);
}

// pure function that returns new sound
export function reduceSound(timeModifier: number, sound: IMenuSound, playing: boolean): IMenuSound {
    return Object.assign({}, sound, {
        playing: playing,
    });
}

export class MenuState2 implements IGameState {
    private menuMusic: IAudioObject;
    constructor(public name: string,
        private menuState: IMenuState) {
            this.menuMusic = new AudioObject(menuState.sound.musicFilename, true);
    }

    update(timeModifier: number): void {
        const menuState: IMenuState = this.menuState;
        // change state!!
        this.menuState = reduceState(timeModifier, menuState, {type:"UPDATE", keys: null, soundPlaying: null});
    }

    display(ctx: DrawContext): void {

        stateToView(ctx, this.menuState);
    }

    sound(timeModifier: number): void {
        const menuState: IMenuState = this.menuState;
        let playing: boolean = stateToAudio(this.menuMusic, menuState.sound.playing);
        // change state!!
        this.menuState = reduceState(timeModifier, menuState, {type: "SOUND", keys: null, soundPlaying: playing});
    }

    input(keys: KeyStateProvider, timeModifier: number): void {
        const menuData: IMenuState = this.menuState;
        // change state!!
        this.menuState = reduceState(timeModifier, menuData, {type:"INPUT", keys: keys.getKeys(), soundPlaying: null});
    }

    tests(lastTestModifier: number): void {
        //
    }

    returnState(): number {
        let newState:number = undefined;
        const menuData: IMenuState = this.menuState;
        if (menuData.menu.selected) {
            // states are 0 to n. (Menu state = 0). focus = 0 to n-1
            // need to offset with +1 to get states 1 to n.
            newState = menuData.menu.itemFocus + 1;
        }
        return newState;
    }
}
