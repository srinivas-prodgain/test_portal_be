import express, { Express } from "express";
import cors from "cors";
import morgan from "morgan";

import { config } from "./config/config";
import { connect_database } from "./config/database";
import { error_handler } from "./middlewares/error_handler";
import { candidates_router } from "./routes/candidates";
import { questions_router } from "./routes/questions";
import { attempts_router } from "./routes/attempts";

export const app: Express = express();

const register_middlewares = (app_instance: Express): void => {
    app_instance.use(
        cors({
            origin: config.node_env === "development" ? "*" : undefined,
            credentials: true,
        })
    );
    app_instance.use(express.json());
    app_instance.use(express.urlencoded({ extended: true }));
    app_instance.use(morgan("dev"));
};

const register_routes = (app_instance: Express): void => {
    app_instance.get("/health", (_req, res) => {
        res.json({
            status: "ok",
        });
    });

    app_instance.use("/api/candidates", candidates_router);
    app_instance.use("/api/questions", questions_router);
    app_instance.use("/api/attempts", attempts_router);
};

const register_error_handlers = (app_instance: Express): void => {
    app_instance.use(error_handler);
};

export const start_server = async (): Promise<void> => {
    register_middlewares(app);
    register_routes(app);
    register_error_handlers(app);

    await connect_database();

    app.listen(config.port, () => {
        console.log(`Server running on port ${config.port}`);
    });
};
