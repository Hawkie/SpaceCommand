var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports"], function (require, exports) {
    "use strict";
    var SparseArray = (function (_super) {
        __extends(SparseArray, _super);
        function SparseArray(size) {
            _super.call(this, size);
        }
        SparseArray.prototype.add = function (item) {
            if (this.indexOf(item) == -1) {
                this.push(item);
            }
        };
        SparseArray.prototype.remove = function (item) {
            var index = this.indexOf(item);
            if (index > -1) {
                this.splice(index, 1);
            }
        };
        return SparseArray;
    }(Array));
    exports.SparseArray = SparseArray;
});
//# sourceMappingURL=SparseArray.js.map