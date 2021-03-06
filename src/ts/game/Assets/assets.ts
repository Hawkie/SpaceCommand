import { IGraphic, Graphic } from "../../gamelib/Elements/Graphic";
import { IAudioObject, AudioObject } from "../../gamelib/Elements/AudioObject";

export class AsteroidAssets {


    // graphics
    public terrain: IGraphic = new Graphic("res/img/terrain.png");
    public coinSprite: IGraphic = new Graphic("res/img/spinningCoin.png");
    public graphicShip: IGraphic = new Graphic("res/img/ship.png");

    // sounds
    public timePortal: IAudioObject = new AudioObject("res/sound/TimePortal.mp3", true);
    public blast: IAudioObject = new AudioObject("res/sound/blast.wav");
    public thrust: IAudioObject = new AudioObject("res/sound/thrust.wav");
    public gun: IAudioObject = new AudioObject("res/sound/raygun-01.mp3");
    public explosion: IAudioObject = new AudioObject("res/sound/explosion.wav");

    public gMap:Map<string, IGraphic> = new Map<string,IGraphic>();

    public readonly width:number = 512;
    public readonly height:number = 480;
}