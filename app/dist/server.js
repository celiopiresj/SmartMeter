"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const index_1 = __importDefault(require("./routes/index"));
const middlewares_1 = require("./middlewares");
const app = (0, express_1.default)();
const PORT = 3000;
(0, index_1.default)(app);
app.use(middlewares_1.handler404);
app.use(middlewares_1.errorHandler);
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
