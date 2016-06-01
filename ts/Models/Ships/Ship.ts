import { IActor } from "ts/Actors/Actor";

// Model Interface

export interface IShipModel extends IActor {
    
    // methods
    left(timeModifier: number);
    right(timeModifier: number);
    thrust();
    noThrust();
    crash();
}

export interface IFiringShipModel extends IShipModel {
    shootPrimary();
}