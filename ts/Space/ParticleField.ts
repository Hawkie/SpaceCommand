import { IGameObject } from "../GameObjects/GameObject";
import { Coordinate } from "../Physics/Common";
import { IDrawable } from "../DisplayObjects/DisplayObject";
import { DrawContext } from "../Common/DrawContext";

export class ParticleDetail {
    location: Coordinate;
    private origin: Coordinate;
    constructor(locationx: number, locationy: number, private velX: number, private velY: number, private bornTime: number) {

        this.location = new Coordinate(locationx, locationy);
        this.origin = new Coordinate(locationx, locationy);
    } 

    update(lastTimeModifier: number) {
        this.location.x += this.velX * lastTimeModifier;
        this.location.y += this.velY * lastTimeModifier;
    }

    get born(): number { 
        return this.bornTime;
    }
    get originX(): number {
        return this.origin.x;
    }
    get originY(): number {
        return this.origin.y;
    }
    

}

export class ParticleField implements IGameObject {
    fieldObjects: ParticleDetail[];

    // starting location functions
    startx: () => number;
    starty: () => number;

    // dynamics of particle
    velx: () => number;
    vely: () => number;

    // particle shape
    item: IDrawable;

    // how frequently a particle appears
    itemsPerSec: number;
    //lastAdded: number;

    // how long a particle survives
    lifeTimeInSec: number;
    range: number;
    maxNumber: number;

    // fadeOut
    firstAdded: number;
    generationTimeInSec: number;

    // init
    lastCheck: number;

    private on: boolean;

    constructor(startx: () => number, starty: () => number, velx: () => number, vely: () => number, item: IDrawable, itemsPerSecond : number, lifeTimeInSec : number = 0, fadeOutInSec : number = 0, on : boolean = true) {
        this.fieldObjects = [];
        this.startx = startx;
        this.starty = starty;
        this.velx = velx;
        this.vely = vely;
        this.item = item;
        this.lifeTimeInSec = lifeTimeInSec;

        // TODO
        this.range = 0;
        this.maxNumber = 0;

        this.firstAdded = 0;
        this.lastCheck = Date.now();
        this.itemsPerSec = itemsPerSecond;

        this.generationTimeInSec = fadeOutInSec;
        this.on = on;
    }

    init() { }

    turnOn() {
        this.on = true;
    }

    turnOff() {
        this.on = false;
    }

    update(lastTimeModifier : number) {
        /// TODO: use distribution pattern for start instead of absolute x,y (canvas size
        var now = Date.now();
        if (!this.on) {
            this.lastCheck = now;
            this.firstAdded = 0;
        }
        if (this.on) {
            var secSinceLast = (now - this.lastCheck) / 1000;

            // Don't add if past generation time
            if (this.generationTimeInSec == 0 || this.firstAdded == 0 || ((now - this.firstAdded) / 1000) < this.generationTimeInSec) {
                
                // find the integer number of particles to add. conservatively round down
                let toAdd = Math.floor(this.itemsPerSec * secSinceLast);
                for (let i: number = 0; i < toAdd; i++) {
                    var o = new ParticleDetail(this.startx(), this.starty(), this.velx(), this.vely(), now);
                    this.fieldObjects.push(o);
                    if (this.firstAdded == 0) this.firstAdded = now;
                    this.lastCheck = now;
                }
            }
        }

        // move objects
        for (var i: number = this.fieldObjects.length-1; i >=0; i--){
            var element = this.fieldObjects[i];
        
            // remove if too old
            let removed = false;
            if (this.lifeTimeInSec > 0) {
                var ageInSec = (now - element.born) / 1000;
                if (ageInSec > this.lifeTimeInSec) {
                    this.fieldObjects.splice(i, 1);
                    removed = true;
                }
            }
            // draw if still remains
            if (!removed) {
                element.update(lastTimeModifier);
            }
        }
    }

    display(drawContext : DrawContext) {
        this.fieldObjects.forEach(element => {
            this.item.draw(element.location, drawContext);
        });
    }
}