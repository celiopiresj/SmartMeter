import express from "express";
import routes from "./routes/index";
import { errorHandler, handler404 } from "./middlewares/index";

const app = express();
const PORT = 3000;

routes(app);
app.use(handler404);
app.use(errorHandler);

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
