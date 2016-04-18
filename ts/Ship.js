var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "./Common/Coordinate", "./Common/GameObject", "./Projectile"], function (require, exports, Coordinate_1, GameObject_1, Projectile_1) {
    "use strict";
    var BasicShip = (function (_super) {
        __extends(BasicShip, _super);
        function BasicShip(displayObject, location, velx, vely, angle, spin) {
            _super.call(this, displayObject, location, velx, vely, angle, spin);
            this.thrustPower = 16;
            this.rotationalPower = 64;
            this.projectiles = new GameObject_1.GameObjectArray();
        }
        BasicShip.prototype.update = function (lastTimeModifier) {
            this.projectiles.update(lastTimeModifier);
            _super.prototype.update.call(this, lastTimeModifier);
        };
        BasicShip.prototype.display = function (drawingContext) {
            this.projectiles.display(drawingContext);
            _super.prototype.display.call(this, drawingContext);
        };
        BasicShip.prototype.thrust = function (lastTimeModifier) {
            //var audio = new Audio("./wav/thrust.wav");
            //audio.play();
            this.angularThrust(this.thrustPower * lastTimeModifier);
        };
        BasicShip.prototype.rotateLeft = function (lastTimeModifier) {
            this.angle -= this.rotationalPower * lastTimeModifier;
        };
        BasicShip.prototype.rotateRight = function (lastTimeModifier) {
            this.angle += this.rotationalPower * lastTimeModifier;
        };
        BasicShip.prototype.shootPrimary = function (lastTimeModifier) {
            var b = new Projectile_1.Bullet(new Coordinate_1.Coordinate(this.location.x, this.location.y), this.angle);
            this.projectiles.add(b);
        };
        return BasicShip;
    }(GameObject_1.MovingGameObject));
    exports.BasicShip = BasicShip;
});
//# sourceMappingURL=Ship.js.map