var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "./Common/GameObject", "./Common/DisplayObject", "./Common/Transforms"], function (require, exports, GameObject_1, DisplayObject_1, Transforms_1) {
    "use strict";
    var Bullet = (function (_super) {
        __extends(Bullet, _super);
        function Bullet(location, angle) {
            var displayObject = new DisplayObject_1.Rect(1, 1);
            var vector = Transforms_1.Transforms.toVector(angle, Bullet.velocity);
            _super.call(this, displayObject, location, vector.x, vector.y, 0, 0);
        }
        Bullet.velocity = 128;
        return Bullet;
    }(GameObject_1.MovingGameObject));
    exports.Bullet = Bullet;
});
//# sourceMappingURL=Projectile.js.map