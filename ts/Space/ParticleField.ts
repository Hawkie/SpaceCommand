﻿import { IGameObject } from "../Common/GameObject";
import { Coordinate } from "../Common/Coordinate";
import { IDisplayObject } from "../DisplayObjects/DisplayObject";
import { DrawContext } from "../Common/DrawContext";

export class ParticleDetail {
    location: Coordinate;
    private origin: Coordinate;
    constructor(locationx: number, locationy: number, private bornTime: number) {
        this.location = new Coordinate(locationx, locationy);
        this.origin = new Coordinate(locationx, locationy);
    } 

    update(locationx: number, locationy: number) {
        this.location.x += locationx;
        this.location.y += locationy;
    }

    born(): number {
        return this.bornTime;
    }
    originx(): number {
        return this.origin.x;
    }
    originy(): number {
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
    duration: number;
    range: number;
    maxNumber: number;

    constructor(startx: () => number, starty: () => number, velx: () => number, vely: () => number, item: IDisplayObject, itemsPerSecond : number) {
        this.fieldObjects = [];
        this.startx = startx;
        this.starty = starty;
        this.velx = velx;
        this.vely = vely;
        this.item = item;
        this.duration = 0;
        this.range = 0;
        this.maxNumber = 0;
        this.lastAdded = 0;
        this.itemsPerSec = itemsPerSecond;
    }

    init() { }

    update(lastDrawModifier) {
        /// TODO: use distribution pattern for start instead of absolute x,y (canvas size
        var now = Date.now();
        var secElapsed = (now - this.lastAdded) / 1000;
        if (secElapsed >= 1 / this.itemsPerSec) {
            var o = new ParticleDetail(this.startx(), this.starty(), now);
            this.fieldObjects.push(o);
            this.lastAdded = now;
        }

        // move objects
        for (var i: number = this.fieldObjects.length-1; i >=0; i--){
            var element = this.fieldObjects[i];
        
            if (this.duration > 0 && (now - element.born()) > this.duration)
                this.fieldObjects.splice(i,1);
            else 
                element.update(this.velx() * lastDrawModifier, this.vely() * lastDrawModifier);
        }
    }

    display(drawContext : DrawContext) {
        this.fieldObjects.forEach(element => {
            this.item.draw(element.location, drawContext);
        });
    }
}