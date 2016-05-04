import { IGameObject } from "../Common/GameObject";
import { Coordinate } from "../Common/Coordinate";
import { IDisplayObject } from "../DisplayObjects/DisplayObject";
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
    item: IDisplayObject;

    // how frequently a particle appears
    itemsPerSec: number;
    lastAdded: number;

    // how long a particle survives
    lifeTimeInSec: number;
    range: number;
    maxNumber: number;

    // fadeOut
    firstAdded: number;
    fadeOutInSec: number;

    on: boolean;

    constructor(startx: () => number, starty: () => number, velx: () => number, vely: () => number, item: IDisplayObject, itemsPerSecond : number, lifeTimeInSec : number = 0, fadeOutInSec : number = 0, on : boolean = true) {
        this.fieldObjects = [];
        this.startx = startx;
        this.starty = starty;
        this.velx = velx;
        this.vely = vely;
        this.item = item;
        this.lifeTimeInSec = lifeTimeInSec;

        this.range = 0;
        this.maxNumber = 0;
        this.lastAdded = 0;
        this.firstAdded = 0;
        this.itemsPerSec = itemsPerSecond;

        this.fadeOutInSec = fadeOutInSec;
        this.on = on;
    }

    init() {
        
    }


    update(lastTimeModifier : number) {
        /// TODO: use distribution pattern for start instead of absolute x,y (canvas size
        if (this.on) {
            var now = Date.now();
            var secSinceLast = (now - this.lastAdded) / 1000;
            var secSinceFirst = (now - this.firstAdded) / 1000;
            if (this.fadeOutInSec == 0 || this.firstAdded == 0 || secSinceFirst < this.fadeOutInSec) {
                if (this.firstAdded == 0) {
                    this.firstAdded = now;
                    this.lastAdded = now;
                }
                else {
                    let toAdd = this.itemsPerSec * secSinceLast;
                    // only add
                    for (let i: number = 0; i < toAdd; i++) {
                        var o = new ParticleDetail(this.startx(), this.starty(), this.velx(), this.vely(), now);
                        this.fieldObjects.push(o);
                        if (this.lastAdded == 0) this.firstAdded = now;
                        this.lastAdded = now;
                    }
                }
            }
        }

        // move objects
        for (var i: number = this.fieldObjects.length-1; i >=0; i--){
            var element = this.fieldObjects[i];
        
            // remove if too old
            var removed = false;
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