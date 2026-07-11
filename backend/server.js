const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const app = express();


// Config
const { connectDatabase, testDBConnection, closeDatabase } = require("./src/config/database");
const config = require("./src/config/index");

const requiredEnvironmentVariables = ["MONGODB_URI"];
const missingEnvironmentVariables = requiredEnvironmentVariables.filter((name) => !process.env[name]);
if (!process.env.JWT_SECRET && !process.env.ACCESS_TOKEN_SECRET) {
   missingEnvironmentVariables.push("JWT_SECRET (or existing ACCESS_TOKEN_SECRET)");
}
if (missingEnvironmentVariables.length > 0) {
   console.error(`Missing required environment variables: ${missingEnvironmentVariables.join(", ")}`);
   process.exit(1);
}

const configuredOrigins = (process.env.FRONTEND_URL || process.env.CORS_ORIGIN || "")
   .split(",")
   .map((origin) => origin.trim().replace(/\/$/, ""))
   .filter(Boolean);
const allowedOrigins = [...new Set([...configuredOrigins, "http://localhost:3000", "http://localhost:5173"])];

app.set("trust proxy", 1);

// Middleware
app.use(express.json()); // Parse JSON bodies
app.use(
   cors({
      origin(origin, callback) {
         const normalizedOrigin = origin?.replace(/\/$/, "");
         if (!origin || allowedOrigins.includes(normalizedOrigin)) return callback(null, true);
         return callback(new Error("Origin not allowed by CORS"));
      },
      methods: ["POST", "GET", "PUT", "DELETE", "OPTIONS"],
      credentials: true,
   })
);
app.use(morgan("combined")); // Log HTTP requests
app.use(cookieParser()); // Parse cookies
app.use(bodyParser.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(express.static("public")); // Serve static files

// Routes
const auth = require("./src/routes/authRoutes");
const funds = require("./src/routes/fundsRoutes");
const manager = require("./src/routes/managerRoutes");
const user = require("./src/routes/userRoutes");
const treks = require("./src/routes/treksRoutes");

app.use("/", auth);
app.use("/funds", funds);
app.use("/manager", manager);
app.use("/user", user);
app.use("/treks", treks);

app.get("/api/health", async (req, res) => {
   try {
      await testDBConnection();
      return res.status(200).json({ success: true, server: "running", database: "connected", timestamp: new Date().toISOString(), environment: process.env.NODE_ENV || "development" });
   } catch (error) {
      return res.status(503).json({ success: false, server: "running", database: "unavailable", timestamp: new Date().toISOString(), environment: process.env.NODE_ENV || "development" });
   }
});

app.use((req, res) => res.status(404).json({ success: false, message: "Route not found" }));

app.use((error, req, res, next) => {
   console.error("Unexpected request error:", error.message);
   const corsError = error.message === "Origin not allowed by CORS";
   res.status(corsError ? 403 : 500).json({ success: false, message: corsError ? error.message : "Internal server error" });
});

// Database connection with retry
const startServer = async (retryCount = 0) => {
   const MAX_RETRIES = 5;
   const RETRY_DELAY = 5000; // 5 seconds

   try {
      await connectDatabase();

      // Start server after successful DB connection
      const server = app.listen(config.appPort, "0.0.0.0", () => {
         console.log(`Server is running on port ${config.appPort}`);
         console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
      });

      // Handle server errors
      server.on("error", (error) => {
         console.error(`Server error: ${error.message}`);
      });

      // Handle process termination
      process.on("SIGTERM", () => {
         console.log("SIGTERM received, shutting down gracefully");
         server.close(async () => {
            await closeDatabase();
            console.log("Server closed");
            process.exit(0);
         });
      });
   } catch (err) {
      console.error(`Database connection error: ${err.message}`);

      if (retryCount < MAX_RETRIES) {
         console.log(
            `Retrying database connection in ${RETRY_DELAY / 1000} seconds... (Attempt ${
               retryCount + 1
            }/${MAX_RETRIES})`
         );
         setTimeout(() => {
            startServer(retryCount + 1);
         }, RETRY_DELAY);
      } else {
         console.error("Maximum retries reached. Server startup failed.");
         process.exit(1);
      }
   }
};

// Start the server
startServer();
