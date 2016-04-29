export interface IBuilding{
    cost : number;              // Price to build.
    powerAffect : number;       // How much power it provides or, if negative, how much it draws.
    workersAffect : number;     // How many workers this building adds or removes.
    drawResources(resources);   // Allow the building to modify how many resources the plant has (eg. A coal plant would need to remove coal).
}
