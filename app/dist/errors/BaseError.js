"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var BaseError = /** @class */ (function (_super) {
    __extends(BaseError, _super);
    function BaseError(message, status, error_code) {
        if (message === void 0) { message = "Erro interno do servidor"; }
        if (status === void 0) { status = 500; }
        if (error_code === void 0) { error_code = "UNKNOWN_ERROR"; }
        var _this = _super.call(this, message) || this;
        _this.message = message;
        _this.status = status;
        _this.error_code = error_code;
        _this.name = _this.constructor.name;
        return _this;
    }
    BaseError.prototype.sendResponse = function (res) {
        return res.status(this.status).send({
            error_code: this.error_code,
            error_description: this.message,
        });
    };
    return BaseError;
}(Error));
exports.default = BaseError;
