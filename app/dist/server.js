"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var index_1 = __importDefault(require("./routes/index"));
var middlewares_1 = require("./middlewares");
var app = (0, express_1.default)();
var PORT = 3000;
(0, index_1.default)(app);
app.use(middlewares_1.handler404);
app.use(middlewares_1.errorHandler);
app.listen(PORT, function () {
    console.log("Server is running on port ".concat(PORT));
});
