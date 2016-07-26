
export interface ISwitch {
    enabled: boolean;
    value: boolean;
    repeat: number;
}

export class EffectData implements ISwitch {
    constructor(public enabled: boolean = false,
        public value: boolean = false,
        public repeat: number = 10) { }
}