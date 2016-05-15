export interface IShip {
    
    // methods
    left(timeModifier: number);
    right(timeModifier: number);
    thrust();
    noThrust();
    crash();
}

export interface IFiringShip extends IShip {
    shootPrimary();
}