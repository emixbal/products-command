import express, { Application, Router } from "express";
import bodyParser from "body-parser"
import morgan from "morgan"
import compression from "compression"
import helmet from "helmet"
import cors from "cors"
import { config as dotenv } from "dotenv";

import UserRoutes from "./routes/UserRoutes";
import AuthRoutes from "./routes/AuthRoutes";
import TodoRoutes from "./routes/TodoRoutes";
import ProductRoutes from "./routes/ProductRoutes";

class App {
    public app: Application;

    constructor() {
        this.app = express();
        dotenv();
        this.plugins();
        this.routes();
    }

    protected plugins(): void {
        this.app.use(bodyParser.json())
        this.app.use(morgan("dev"))
        this.app.use(compression())
        this.app.use(helmet())
        this.app.use(cors())
    }

    protected routes(): void {
        const v1: Router = express.Router();

        v1.use('/users', UserRoutes);
        v1.use('/auth', AuthRoutes);
        v1.use('/todos', TodoRoutes);
        v1.use('/products', ProductRoutes);

        this.app.use('/v1', v1);

    }
}

const app = new App().app;
app.listen(process.env.APP_PORT, () => {
    console.log(`app run in ${process.env.APP_PORT}`);
})