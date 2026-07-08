import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import projectRoutes from "./routes/project.routes.js";
import plotRoutes from "./routes/plot.routes.js";
import requirementRoutes from "./routes/requirement.routes.js";
import layoutRoutes from "./routes/layout.routes.js";
import errorMiddleware from "./middleware/error.middleware.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/plots", plotRoutes);
app.use("/api/requirements", requirementRoutes);
app.use("/api/layouts", layoutRoutes);

app.use(errorMiddleware);

export default app;