
export function Wrap(value: number, lowLimit:number, upLimit: number): number {
    if (value > upLimit) { return lowLimit; }
    if (value < lowLimit) { return upLimit; }
    return value;
}
