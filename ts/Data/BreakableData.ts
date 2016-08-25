export interface IBreakable {
    maxHitPoints: number;
    hitPoints: number;
    armour: number;
    disabled: boolean;
    broken: boolean;
}

export class BreakableData implements IBreakable {
    constructor(public maxHitPoints: number,
        public hitPoints: number,
        public armour: number,
        public disabled: boolean = false,
        public broken: boolean = false) { }
}

