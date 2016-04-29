import { IGameState } from "GameState";
import { DrawContext} from "../Common/DrawContext";
import { Keys, KeyStateProvider } from "../Common/KeyStateProvider";
import { IBuilding } from "../Buildings/Building";
import { Grid } from "../Buildings/Grid";

export class PlanetBuildingState implements IGameState{
    grid : Grid = new Grid();
    buildings : IBuilding[];
    power : number = 0;
    workers : number = 0;
    
    update(lastDrawModifier : number){
        this.grid.update(lastDrawModifier);
    }
    
    display(drawingContext : DrawContext){
        this.grid.display(drawingContext);
    }
    
    input(keys : KeyStateProvider, lastDrawModifier : number){
    }
    
    tests(){}
    
    hasEnded() : boolean{
        return false;
    }
}