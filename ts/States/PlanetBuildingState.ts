import { IGameState } from "GameState";
import { DrawContext} from "../Common/DrawContext";
import { Keys, KeyStateProvider } from "../Common/KeyStateProvider";
import { IBuilding } from "../Buildings/Building";

export class PlanetBuildingState implements IGameState{
    buildings : IBuilding[];
    
    update(lastDrawModifier : number){
    }
    
    display(drawingContext : DrawContext){
    }
    
    input(keys : KeyStateProvider, lastDrawModifier : number){
    }
    
    tests(){}
    
    hasEnded() : boolean{
        return false;
    }
}